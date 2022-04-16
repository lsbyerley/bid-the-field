import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '../../util/supabaseClient';
import playersData from '../../util/masters-2022.json';
import { useIntervalWhen } from 'rooks';

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
// 2. update auctionOver when auction data changes from sub

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
  const [bids, setBids] = useState(bidsData);
  const [auction, setAuction] = useState(auctionData);
  const [auctionOver, setAuctionOver] = useState(() => {
    return new Date(auction?.end_date) < new Date();
  });

  useIntervalWhen(
    () => {
      console.log('LOG: interval check auction time left');
    },
    10000,
    !auctionOver,
    true
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const bidsSubscription = supabase
      .from(`Bids:auction_id=eq.${auction.id}`)
      .on('*', (payload) => {
        console.log('LOG: bids change!', payload?.eventType, payload);
        if (payload?.eventType === 'INSERT') {
          console.log('LOG: bid inserted', payload);
          setBids([...bids, payload.new]);
        }
        if (payload?.eventType === 'UPDATE') {
          const index = bids.indexOf(payload?.new?.id);
          console.log('LOG: bids updated', index, payload);
        }
        if (payload?.eventType === 'DELETE') {
          const index = bids.indexOf(payload?.new?.id);
          console.log('LOG: bids deleted', index, payload);
        }
      })
      .subscribe();

    return () => supabase.removeSubscription(bidsSubscription);
  }, []);

  useEffect(() => {
    const auctionUpdateSubscription = supabase
      .from(`Auctions:id=eq.${auction.id}`)
      .on('UPDATE', (payload) => {
        console.log('LOG: auction updated', payload);
        setAuction({ ...auction, ...payload.new });
      })
      .subscribe();

    return () => supabase.removeSubscription(auctionUpdateSubscription);
  }, []);

  const onSubmitBid = async (bidAmount, playerId) => {
    const { data, error } = await supabase.from('Bids').insert([
      {
        auction_id: auction.id,
        player_id: playerId,
        amount: bidAmount,
        owner: session.user.email,
      },
    ]);

    if (error) {
      console.log('LOG: error submitting bid', error.message);
    }

    setActiveBidPlayer();
    console.log('LOG: data', data);
  };

  const openBidModal = ({ player, highestBid }) => {
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

  if (!auction) {
    return (
      <Layout>
        <p>Auction Not Found. Check the id and try again</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <AuctionHeader auction={auction} auctionOver={auctionOver} />

      <div className='grid max-w-6xl grid-cols-1 gap-6 px-2 mx-auto mt-8 mb-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
        <div className='lg:col-start-3 lg:col-span-1'>
          <OwnerWinningBids
            bids={bids}
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
                  bids={bids}
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
