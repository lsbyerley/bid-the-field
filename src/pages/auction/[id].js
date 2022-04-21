import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '../../util/supabaseClient';
import playersData from '../../util/masters-2022.json';
import { useIntervalWhen, useCountdown } from 'rooks';
import {
  isAuctionOver,
  secondsLeft,
  minutesLeft,
} from '../../util/auctionUtils';
import useAsyncReference from '../../util/useAsyncReference';
import { addMinutes } from 'date-fns';

// Components
import Layout from '../../components/Layout';
import AccessDenied from '../../components/AccessDenied';
import BidModal from '../../components/BidModal';
import OwnerWinningBids from '../../components/OwnerWinningBids';
import AuctionHeader from '../../components/AuctionHeader';
import BidRow from '../../components/BidRow';

//https://github.com/nextauthjs/next-auth-example/blob/main/pages/server.tsx

//TODO's
// 1. order player list by highest bids
// 2. if player highest bid updates when modal open, update the required bid amount in the modal

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

  return {
    props: {
      auctionData: auction,
      bidsData: bids,
    },
  };
}

const AuctionPage = ({ auctionData = {}, bidsData = [] }) => {
  const [mounted, setMounted] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const sessionLoading = sessionStatus === 'loading';
  const [isOpen, setIsOpen] = useState(false);
  const [activeBidPlayer, setActiveBidPlayer] = useState();
  const [bids, setBids] = useAsyncReference(bidsData);
  const [auction, setAuction] = useAsyncReference(auctionData);
  const [auctionOver, setAuctionOver] = useState(() =>
    isAuctionOver(auctionData)
  );

  useEffect(() => setMounted(true), []);

  useIntervalWhen(
    () => {
      console.log(
        'LOG: interval check auction is over',
        isAuctionOver(auction.current)
      );
      if (!auctionOver && isAuctionOver(auction.current)) {
        setAuctionOver(true);
      }
    },
    10000,
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

    setActiveBidPlayer();
    console.log('LOG: data', data);
  };

  const openBidModal = ({ player, highestBid }) => {
    // TODO: #2 above
    setActiveBidPlayer({ ...player, highestBid });
    setIsOpen(true);
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

  return (
    <Layout>
      <AuctionHeader auction={auction.current} auctionOver={auctionOver} />

      <div className='grid max-w-6xl grid-cols-1 gap-6 px-2 mx-auto mt-8 mb-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
        <div className='lg:col-start-3 lg:col-span-1'>
          <OwnerWinningBids
            bids={bids.current}
            session={session}
            playersData={playersData}
          />
        </div>
        <div className='space-y-6 lg:col-start-1 lg:col-span-2'>
          <ul
            role='list'
            className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
          >
            {playersData.players.map((p) => {
              return (
                <BidRow
                  key={p.id}
                  player={p}
                  openBidModal={openBidModal}
                  bids={bids.current}
                  biddingDisabled={isOpen || auctionOver}
                />
              );
            })}
          </ul>
        </div>
      </div>
      <BidModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmitBid}
        player={activeBidPlayer}
      />
    </Layout>
  );
};

export default AuctionPage;
