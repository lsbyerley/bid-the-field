import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { supabase } from '../../../lib/supabaseClient';
import useAsyncReference from '../../../lib/useAsyncReference';
import { isAuctionOver } from '../../../lib/auctionUtils';

// Components
import Layout from '../../../components/Layout';
import AccessDenied from '../../../components/AccessDenied';
import AuctionHeader from '../../../components/AuctionHeader';

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
  const [auctionOver, setAuctionOver] = useState(() =>
    isAuctionOver(auctionData)
  );

  useEffect(() => setMounted(true), []);

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
      <Head>
        <title>Bid The Field - Results {auction.current.name}</title>
      </Head>
      <AuctionHeader auction={auction.current} auctionOver={auctionOver} />

      <h2 className='py-6 text-lg text-center'>Auction RESULTS TBD</h2>

      {!auctionOver && (
        <div className='shadow-lg alert'>
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
              <h3 className='font-bold'>Auction still in progress!</h3>
              <div className='text-xs'>Check back when the auction is over</div>
            </div>
          </div>
          <div className='flex-none'>
            <Link href={`/auction/${auction.current.id}`}>
              <a className='btn btn-sm'>See Live</a>
            </Link>
          </div>
        </div>
      )}

      <div className='grid max-w-6xl grid-cols-1 gap-6 px-2 mx-auto mt-8 mb-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'></div>
    </Layout>
  );
};

export default AuctionPage;