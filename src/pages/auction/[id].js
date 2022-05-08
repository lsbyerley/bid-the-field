import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { supabase } from '../../lib/supabaseClient';
import { useIntervalWhen } from 'rooks';
import {
  isAuctionOver,
  secondsLeft,
  shouldDisableField,
} from '../../lib/auctionUtils';
import useAsyncReference from '../../lib/useAsyncReference';
import { addMinutes } from 'date-fns';

// Components
import Layout from '../../components/Layout';
import AccessDenied from '../../components/AccessDenied';
import OwnerWinningBids from '../../components/OwnerWinningBids';
import TotalPot from '../../components/TotalPot';
import NameCard from '../../components/Auction/NameCard/NameCard';
import StartDateCard from '../../components/Auction/StartDateCard/StartDateCard';
import EndDateCard from '../../components/Auction/EndDateCard/EndDateCard';
import RulesPayoutsCard from '../../components/Auction/RulesPayoutsCard/RulesPayoutsCard';
import BidRow from '../../components/BidRow';
import Countdown from '../../components/Countdown';

// CONSTANTS
const DEFAULT_INTERVAL_CHECK = 10000; // 10 seconds in milliseconds
const QUICK_INTERVAL_CHECK = 1000; // 1 second in milliseconds

//https://github.com/nextauthjs/next-auth-example/blob/main/pages/server.tsx

//TODO's
// 1. order player list by highest bids

export async function getServerSideProps({ params }) {
  const { data: auction, error: auctionError } = await supabase
    .from('Auctions')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: bids, error: bidsError } = await supabase
    .from('Bids')
    .select('*')
    .eq('auction_id', params.id);

  if (auctionError) {
    console.log('LOG: auctionError', auctionError.message);
  }
  if (bidsError) {
    console.log('LOG: bidsError', bidsError.message);
  }

  let players;
  try {
    players = await import(`../../lib/${auction.data_filename}.json`);
  } catch (err) {
    console.log('LOG: error importing players json file');
  }

  return {
    props: {
      auctionData: auction,
      bidsData: bids,
      playersData: players?.data || [],
    },
  };
}

const AuctionPage = ({ auctionData = {}, bidsData = [], playersData = [] }) => {
  const [mounted, setMounted] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const sessionLoading = sessionStatus === 'loading';
  const [bids, setBids] = useAsyncReference(bidsData);
  const [auction, setAuction] = useAsyncReference(auctionData);
  const [bidSubmitLoading, setBidSubmitLoading] = useState(false);
  const [auctionOver, setAuctionOver] = useState(() =>
    isAuctionOver(auctionData)
  );
  const [disableTheField, setDisableTheField] = useState(() =>
    shouldDisableField(auctionData)
  );
  const [intervalCheck, setIntervalCheck] = useState(() => {
    return secondsLeft(auction.current) <= 60
      ? QUICK_INTERVAL_CHECK
      : DEFAULT_INTERVAL_CHECK;
  });

  useEffect(() => setMounted(true), []);

  useIntervalWhen(
    () => {
      console.log(
        'LOG: interval check auction is over',
        isAuctionOver(auction.current)
      );
      // if 60 seconds or less are left in auction, set interval check to quick interval
      if (
        intervalCheck === DEFAULT_INTERVAL_CHECK &&
        secondsLeft(auction.current) <= 60
      ) {
        setIntervalCheck(QUICK_INTERVAL_CHECK);
      }
      if (!auctionOver && isAuctionOver(auction.current)) {
        setAuctionOver(true);
      }
      if (!disableTheField && shouldDisableField(auctionData)) {
        setDisableTheField(true);
      }
    },
    intervalCheck,
    !auctionOver,
    true
  );

  const handleUpdateBids = (payload) => {
    if (payload?.eventType === 'INSERT') {
      const updatedBids = [...bids.current, payload.new];
      setBids(updatedBids);
    }
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
    const bidsSubscription = supabase
      .from(`Bids:auction_id=eq.${auction.current?.id}`)
      .on('INSERT', (payload) => {
        console.log('LOG: bids changed', payload);
        handleUpdateBids(payload);
      })
      .on('UPDATE', (payload) => {
        console.log('LOG: bids changed', payload);
        handleUpdateBids(payload);
      })
      .subscribe();

    return () => supabase.removeSubscription(bidsSubscription);
  }, []);

  useEffect(() => {
    const auctionUpdateSubscription = supabase
      .from(`Auctions:id=eq.${auction.current?.id}`)
      .on('UPDATE', (payload) => {
        console.log('LOG: auction updated', payload);
        handleUpdateAuction(payload);
      })
      .subscribe();

    return () => supabase.removeSubscription(auctionUpdateSubscription);
  }, []);

  const updateAuctionEndTime = async (minutesToAdd) => {
    const dateAddThreeMinutes = addMinutes(
      new Date(auction.current?.end_date),
      minutesToAdd
    );
    const { data: updateAuctionData, error: updateAuctionError } =
      await supabase
        .from(`Auctions`)
        .update({ end_date: dateAddThreeMinutes })
        .match({ id: auction.current?.id });
  };

  const onSubmitBid = async (bidAmount, playerId) => {
    if (auctionOver) {
      alert('Too late! auction has ended!');
      return;
    }
    setBidSubmitLoading(true);

    const { data, error } = await supabase.from('Bids').insert([
      {
        auction_id: auction.current?.id,
        player_id: playerId,
        amount: bidAmount,
        owner: session.user.email,
      },
    ]);

    if (error) {
      console.log('LOG: error submitting bid', error.message);
    }

    const auctionSecondsLeft = secondsLeft(auction.current);
    if (!error && auctionSecondsLeft > 0 && auctionSecondsLeft <= 180) {
      console.log('LOG: add 3 minutes to auction', auctionSecondsLeft);
      updateAuctionEndTime(3);
    }

    setBidSubmitLoading(false);
    console.log('LOG: data', data);
  };

  // When rendering client side don't display anything until loading is complete
  // https://github.com/nextauthjs/next-auth-example/blob/main/pages/protected.tsx
  if (typeof window !== 'undefined' && sessionLoading) return null;

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  if (!auction.current) {
    return (
      <Layout>
        <p className='py-6 text-center'>
          Auction Not Found. Check the ID and try again
        </p>
      </Layout>
    );
  }

  const ResultsLink = () => {
    return (
      <div className='rounded-lg card compact bg-base-200 '>
        <div className='justify-center card-body'>
          <Link href={`/auction/results/${auction.current.id}`}>
            <a className='btn btn-ghost btn-sm'>Rosters / Results</a>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Bid The Field - {auction.current.name}</title>
      </Head>

      <div className='grid grid-cols-1 gap-6 px-2 py-4 mx-auto max-w-7xl xl:grid-cols-3'>
        <NameCard auction={auction.current} />
        <EndDateCard auction={auction.current} auctionOver={auctionOver} />
        <OwnerWinningBids
          bids={bids.current}
          session={session}
          playersData={playersData}
        />
        {/*<StartDateCard auction={auction.current} />*/}
        <RulesPayoutsCard auction={auction.current} />
        <ResultsLink />
        <Countdown auction={auction.current} setAuctionOver={setAuctionOver} />
        <TotalPot bids={bids.current} />
      </div>
      <h3 className='px-2 py-6 text-lg font-semibold text-center uppercase'>
        Player Pool
      </h3>
      <div className='px-2 py-4 mx-auto max-w-7xl'>
        {playersData && playersData.length > 0 && (
          <ul
            role='list'
            className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4'
          >
            {playersData.map((p) => {
              return (
                <BidRow
                  key={p.id}
                  player={p}
                  bids={bids.current}
                  biddingDisabled={bidSubmitLoading || auctionOver}
                  disableTheField={disableTheField}
                  onSubmitBid={onSubmitBid}
                />
              );
            })}
          </ul>
        )}
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
                  Players data was not found for this auction! File:{' '}
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
