import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import useAsyncReference from '@/lib/useAsyncReference';
import { isAuctionOver } from '@/lib/auctionUtils';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Components
import Layout from '@/components/Layout';
import AccessDenied from '@/components/AccessDenied';
import Results from '@/components/Results';
import TotalPot from '@/components/TotalPot';
import RulesPayoutsCard from '@/components/RulesPayoutsCard';

// TODO: add live bids updating here?

export async function getServerSideProps({ params }) {
  const { data: auction, error: auctionError } = await supabaseClient
    .from('auctions')
    .select('*')
    .eq('id', params.id)
    .single();

  const { data: bids, error: bidsError } = await supabaseClient
    .from('bids')
    .select(`*, profile:owner_id(email,name)`)
    .eq('auction_id', params.id);

  if (auctionError) {
    console.log('LOG: auctionError', auctionError.message);
  }
  if (bidsError) {
    console.log('LOG: bidsError', bidsError.message);
  }

  let players;
  try {
    players = await import(`@/lib/player-pool/${auction.data_filename}.json`);
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

const AuctionResultsPage = ({
  auctionData = {},
  bidsData = [],
  playersData = [],
}) => {
  const [mounted, setMounted] = useState(false);
  const { isLoading, user } = useUser();
  const [bids, setBids] = useAsyncReference(bidsData);
  const [auction, setAuction] = useAsyncReference(auctionData);
  const [auctionOver, setAuctionOver] = useState(() =>
    isAuctionOver(auctionData)
  );

  useEffect(() => setMounted(true), []);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && isLoading) return null;

  if (!user) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  if (!auction.current) {
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
              <Link href='/'>
                <a className='btn btn-sm'>Go Home</a>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Bid The Field - Results {auction.current.name}</title>
      </Head>

      <nav className='flex justify-center mt-6 mb-4' aria-label='Breadcrumb'>
        <ol role='list' className='flex items-center space-x-4'>
          <li>
            <div className='flex items-center'>
              <Link href={`/auction/${auction.current.id}`}>
                <a className='ml-4 text-sm font-medium md:text-lg '>
                  {auction.current.name}
                </a>
              </Link>
            </div>
          </li>
          <li>
            <div className='flex items-center'>
              <ChevronRightIcon
                className='flex-shrink-0 w-5 h-5'
                aria-hidden='true'
              />
              <span className='ml-4 text-sm font-medium md:text-lg'>
                Rosters / Results
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className='px-2 py-4 mx-auto max-w-7xl'>
        {!auctionOver && (
          <div className='mb-8 rounded-lg alert bg-base-100'>
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
                <h3 className='font-bold'>Auction not over!</h3>
                <div className='text-xs'>Auction is still in progress</div>
              </div>
            </div>
            <div className='flex-none'>
              <Link href={`/auction/${auction.current.id}`}>
                <a className='btn btn-sm'>View Auction</a>
              </Link>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 gap-6 mb-8 md:grid-cols-2'>
          <TotalPot bids={bids.current} />
          <RulesPayoutsCard auction={auction.current} />
        </div>

        <Results bids={bids.current} players={playersData} />
      </div>
    </Layout>
  );
};

export default AuctionResultsPage;
