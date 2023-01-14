import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useIntervalWhen } from 'rooks';
import {
  hasAuctionStarted,
  isAuctionOver,
  secondsLeftEnd,
  secondsLeftStart,
  shouldDisableField,
} from '@/lib/auctionUtils';
import useAsyncReference from '@/lib/useAsyncReference';
import { addMinutes } from 'date-fns';

// Components
import Layout from '@/components/Layout';
import OwnerWinningBids from '@/components/OwnerWinningBids';
import TotalPot from '@/components/TotalPot';
import NameCard from '@/components/NameCard';
import StartDateCard from '@/components/StartDateCard';
import EndDateCard from '@/components/EndDateCard';
import RulesPayoutsCard from '@/components/RulesPayoutsCard';
import BidField from '@/components/BidField';
import Countdown from '@/components/Countdown';

// CONSTANTS
const DEFAULT_INTERVAL_CHECK = 10000; // 10 seconds in milliseconds
const QUICK_INTERVAL_CHECK = 1000; // 1 second in milliseconds

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };

  // Run queries with RLS on the server
  const params = ctx.params;
  try {
    const { data: auction, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', params.id)
      .single();

    // https://supabase.com/docs/reference/javascript/select#query-foreign-tables

    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select(`*, profile:owner_id(email,name)`)
      .eq('auction_id', params.id);

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (auctionError) {
      console.log('LOG: auctionError', auctionError);
    }
    if (bidsError) {
      console.log('LOG: bidsError', bidsError);
    }
    if (profilesError) {
      console.log('LOG: profilesError', profilesError);
    }

    let players;
    try {
      players = await import(`@/lib/player-pool/${auction.data_filename}.json`);
    } catch (err) {
      console.log('LOG: error importing players json file');
    }

    //console.log('LOG: bids', bids);

    return {
      props: {
        profilesData: profiles || [],
        auctionData: auction,
        bidsData: bids || [],
        playersData: players?.data || [],
      },
    };
  } catch (error) {
    console.log('LOG: server error', error);
    return {
      props: {
        profilesData: [],
        auctionData: {},
        bidsData: [],
        playersData: [],
      },
    };
  }
};

const AuctionPage = ({
  profilesData = [],
  auctionData = {},
  bidsData = [],
  playersData = [],
}) => {
  const { session } = useSessionContext();
  const supabaseClient = useSupabaseClient();

  const [bids, setBids] = useAsyncReference(bidsData);
  const [auction, setAuction] = useAsyncReference(auctionData);
  const [bidSubmitLoading, setBidSubmitLoading] = useState(false);
  const [auctionStarted, setAuctionStarted] = useState(() =>
    hasAuctionStarted(auctionData)
  );
  const [auctionOver, setAuctionOver] = useState(() =>
    isAuctionOver(auctionData)
  );
  const [disableTheField, setDisableTheField] = useState(() =>
    shouldDisableField(auctionData)
  );
  const [intervalCheckStart, setIntervalCheckStart] = useState(() => {
    return secondsLeftStart(auction.current) <= 60
      ? QUICK_INTERVAL_CHECK
      : DEFAULT_INTERVAL_CHECK;
  });
  const [intervalCheckEnd, setIntervalCheckEnd] = useState(() => {
    return secondsLeftEnd(auction.current) <= 60
      ? QUICK_INTERVAL_CHECK
      : DEFAULT_INTERVAL_CHECK;
  });

  // AUCTION END INTERVAL CHECK
  useIntervalWhen(
    () => {
      console.log(
        `LOG: interval auctionOver: ${isAuctionOver(auction.current)}`
      );
      // if 60 seconds or less are left until auction ends, set interval check to quick interval
      if (
        intervalCheckEnd === DEFAULT_INTERVAL_CHECK &&
        secondsLeftEnd(auction.current) <= 60
      ) {
        setIntervalCheckEnd(QUICK_INTERVAL_CHECK);
      }
      // TODO: below if's could be refactored to work when auction dates go backwards when updating via admin console
      if (!auctionOver && isAuctionOver(auction.current)) {
        setAuctionOver(true);
      }
      // Disable bids on players without a bid 30 minutes before end date as they become part of The Field
      if (!disableTheField && shouldDisableField(auctionData)) {
        setDisableTheField(true);
      }
    },
    intervalCheckEnd,
    auction?.current && auctionStarted && !auctionOver,
    true
  );

  // AUCTION START INTERVAL CHECK
  useIntervalWhen(
    () => {
      console.log(
        `LOG: interval auctionStarted: ${hasAuctionStarted(auction.current)}`
      );
      // if 60 seconds or less are left to start the auction, set interval check to quick interval
      if (
        intervalCheckStart === DEFAULT_INTERVAL_CHECK &&
        secondsLeftStart(auction.current) <= 60
      ) {
        setIntervalCheckStart(QUICK_INTERVAL_CHECK);
      }
      if (!auctionStarted && hasAuctionStarted(auction.current)) {
        setAuctionStarted(true);
      }
    },
    intervalCheckStart,
    auction?.current && !auctionStarted,
    true
  );

  const handleUpdateBids = (payload) => {
    if (payload?.eventType === 'INSERT') {
      const newBid = {
        ...payload.new,
        profile: profilesData.find(
          (profile) => profile.id === payload.new.owner_id
        ),
      };
      const updatedBids = [...bids.current, newBid];
      setBids(updatedBids);
    }
    // TODO: not needed, could probably remove
    if (payload?.eventType === 'UPDATE') {
      const updatedBids = [...bids.current];
      const indexOfBidToUpdate = bids.current.findIndex(
        (b) => b.id === payload.new.id
      );
      updatedBids.splice(indexOfBidToUpdate, 1, payload.new);
      setBids(updatedBids);
    }
  };

  const handleUpdateAuction = (payload) => {
    setAuction({ ...auction.current, ...payload.new });
    const isAuctionOver =
      new Date(payload?.new?.end_date) < new Date() || false;
    setAuctionOver(isAuctionOver);
  };

  useEffect(() => {
    const bidsSubscription = supabaseClient
      .channel('public:bids')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auction.current?.id}`,
        },
        (payload) => {
          console.log('LOG: bids sub insert', payload);
          handleUpdateBids(payload);
        }
      )
      .subscribe();

    return () => supabaseClient.removeChannel(bidsSubscription);
  }, [supabaseClient]);

  useEffect(() => {
    const auctionUpdateSubscription = supabaseClient
      .channel('public:auctions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${auction.current?.id}`,
        },
        (payload) => {
          console.log('LOG: auction updated', payload);
          handleUpdateAuction(payload);
        }
      )
      .subscribe();

    return () => supabaseClient.removeChannel(auctionUpdateSubscription);
  }, [supabaseClient]);

  const updateAuctionEndTime = async (minutesToAdd) => {
    const dateAddThreeMinutes = addMinutes(
      new Date(auction.current?.end_date),
      minutesToAdd
    );
    const { data: updateAuctionData, error: updateAuctionError } =
      await supabaseClient
        .from(`auctions`)
        .update({ end_date: dateAddThreeMinutes })
        .match({ id: auction.current?.id });
  };

  const onSubmitBid = async (bidAmount, playerId) => {
    if (auctionOver) {
      alert('Too late! auction has ended!');
      return;
    }
    setBidSubmitLoading(true);

    // console.log('LOG: submit bit', bidAmount, user.id);

    const { data, error } = await supabaseClient.from('bids').insert([
      {
        auction_id: auction.current?.id,
        player_id: playerId,
        amount: bidAmount,
        owner_id: session?.user?.id,
      },
    ]);

    if (error) {
      setBidSubmitLoading(false);
      console.log('LOG: bid error', error);
      alert('Error submitting bid: ', error?.message);
      return;
    }

    const auctionSecondsLeft = secondsLeftEnd(auction.current);
    if (!error && auctionSecondsLeft > 0 && auctionSecondsLeft <= 180) {
      console.log('LOG: add 3 minutes to auction', auctionSecondsLeft);
      updateAuctionEndTime(3);
    }

    setBidSubmitLoading(false);
  };

  if (!auction?.current) {
    return (
      <Layout>
        <div className='px-2 py-4 mx-auto max-w-7xl xl:px-0'>
          <div className='mt-16 rounded-lg alert bg-base-100'>
            <div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='flex-shrink-0 w-6 h-6 stroke-info'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                ></path>
              </svg>
              <div>
                <h3 className='font-bold'>Auction not found!</h3>
                <div className='text-xs'>
                  Check the ID and try again or go to the home page.
                </div>
              </div>
            </div>
            <div className='flex-none'>
              <Link href='/' className='btn btn-sm'>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const ResultsLink = () => {
    return (
      <div className='rounded-lg card compact bg-base-100'>
        <div className='justify-center card-body'>
          <Link
            href={`/auction/results/${auction.current.id}`}
            className='btn btn-ghost btn-sm'
          >
            Rosters / Results
          </Link>
        </div>
      </div>
    );
  };

  const pageTitle = `Bid The Field - ${auction.current?.name}`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className='grid grid-cols-1 gap-6 px-2 py-4 mx-auto max-w-7xl md:grid-cols-3 xl:px-0'>
        <NameCard auction={auction.current} />
        {!auctionStarted && (
          <StartDateCard
            auction={auction.current}
            auctionStarted={auctionStarted}
          />
        )}
        {auctionStarted && (
          <EndDateCard auction={auction.current} auctionOver={auctionOver} />
        )}

        <OwnerWinningBids
          bids={bids.current}
          user={session?.user}
          players={playersData}
        />
        <RulesPayoutsCard auction={auction.current} />
        <ResultsLink />
        <Countdown
          auction={auction.current}
          auctionStarted={auctionStarted}
          setAuctionStarted={setAuctionStarted}
          auctionOver={auctionOver}
          setAuctionOver={setAuctionOver}
        />
        <TotalPot bids={bids.current} />
      </div>
      <h3 className='px-2 py-6 text-lg font-semibold text-center uppercase xl:px-0'>
        Player Pool
      </h3>
      <div className='px-2 py-4 mx-auto mb-8 xl:px-0 max-w-7xl'>
        <BidField
          sport={auction.current.sport}
          playersData={playersData}
          bids={bids.current}
          biddingDisabled={bidSubmitLoading || auctionOver || !auctionStarted}
          disableTheField={disableTheField}
          onSubmitBid={onSubmitBid}
        />
        {!playersData ||
          (playersData.length === 0 && (
            <div className='shadow-lg alert'>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='flex-shrink-0 w-6 h-6 stroke-current'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <span>
                  Player pool not available yet for this auction. File:{' '}
                  {auctionData?.data_filename}
                </span>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default AuctionPage;
