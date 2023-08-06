import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import useAsyncReference from '@/lib/useAsyncReference';
import { isAuctionOver } from '@/lib/auctionUtils';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// types
import { GetServerSidePropsContext } from 'next';
import type { AuctionResultsPageProps } from '@/types';

// Components
import Layout from '@/components/Layout';
import Results from '@/components/Results';
import TotalPot from '@/components/TotalPot';
import RulesPayoutsCard from '@/components/RulesPayoutsCard';

// TODO: add live bids updating here?

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(ctx);
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

    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select(`*, profile:owner_id(email,name)`)
      .eq('auction_id', params.id);

    if (auctionError) {
      console.error('LOG: auctionError', auctionError.message);
    }
    if (bidsError) {
      console.error('LOG: bidsError', bidsError.message);
    }

    let players;
    try {
      players = await import(`@/lib/player-pool/${auction.data_filename}.json`);
    } catch (err) {
      console.error('LOG: error importing players json file');
    }

    return {
      props: {
        auctionData: auction,
        bidsData: bids,
        playersData: players?.data || [],
      },
    };
  } catch (error) {
    console.error('LOG: getServerSideProps error:', error);
    return {
      props: {
        auctionData: {},
        bidsData: [],
        playersData: [],
      },
    };
  }
};

const AuctionResultsPage: NextPage = ({
  auctionData,
  bidsData,
  playersData,
}: AuctionResultsPageProps) => {
  const [bids] = useAsyncReference(bidsData);
  const [auction] = useAsyncReference(auctionData);
  const [auctionOver] = useState(() => isAuctionOver(auctionData));

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
              <Link href='/' className='btn btn-sm no-animation'>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const pageTitle = `Bid The Field - Results ${auction.current.name}`;

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <nav className='flex justify-center mt-6 mb-4' aria-label='Breadcrumb'>
        <ol role='list' className='flex items-center space-x-4'>
          <li>
            <div className='flex items-center'>
              <Link
                href={`/auction/${auction.current.id}`}
                className='ml-4 text-sm font-medium md:text-lg '
              >
                {auction.current.name}
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
            <div className='flex-none'>
              <Link
                href={`/auction/${auction.current.id}`}
                className='btn btn-sm no-animation'
              >
                View Auction
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
