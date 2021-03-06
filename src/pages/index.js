import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { hasAuctionStarted, isAuctionOver } from '@/lib/auctionUtils';

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase
    .from('auctions')
    .select()
    .order('start_date', { ascending: false });

  if (error) {
    console.log('LOG: error fetching auctions', error.message);
  }

  return {
    props: {
      auctions: data || [],
    },
  };
}

export default function Home({ auctions = [] }) {
  // const { data: session, status: sessionStatus } = useSession();
  const { isLoading, user, error } = useUser();
  //const sessionLoading = sessionStatus === 'loading';

  return (
    <Layout>
      <Head>
        <title>Bid The Field</title>
      </Head>
      <div className='hero'>
        <div className='pt-8 text-center hero-content'>
          <div className='max-w-md'>
            <h1 className='mb-4 text-3xl font-bold'>Bid The Field</h1>
            <p className='pt-2'>
              This site is meant to function as an automated replacement for the
              excel spreadsheet auction/calcutta mayhem and is still under
              active development
            </p>
            <p className='pt-2'>
              Suggestions on improvement are encouraged &#129305;
            </p>
            {!user && (
              <p className='pt-2'>
                You must have a google account to sign in and place bids
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='max-w-2xl px-2 py-4 mx-auto lg:max-w-7xl md:px-0'>
        <div className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-3'>
          {auctions?.length > 0 &&
            auctions.map((a) => {
              const auctionStarted = hasAuctionStarted(a);
              const auctionOver = isAuctionOver(a);
              return (
                <div
                  key={a.id}
                  className='relative rounded-lg card bg-base-100'
                >
                  {!auctionStarted && (
                    <div className='absolute badge badge-warning badge-outline top-5 right-5'>
                      Not Started
                    </div>
                  )}
                  {auctionOver && (
                    <div className='absolute badge badge-error badge-outline top-5 right-5'>
                      Bidding Over
                    </div>
                  )}
                  {auctionStarted && !auctionOver && (
                    <div className='absolute badge badge-success badge-outline top-5 right-5'>
                      In Progress
                    </div>
                  )}
                  <div className='card-body'>
                    <h2 className='mt-4 card-title'>{a.name}</h2>
                    <p className='py-6'>{a?.description || '-'}</p>
                    <div className='justify-center card-actions'>
                      {!isLoading && !user && (
                        <button
                          className='btn btn-outline btn-sm'
                          onClick={() => {
                            supabaseClient.auth.signIn({ provider: 'google' });
                          }}
                        >
                          Sign In To Bid
                        </button>
                      )}
                      {!isLoading && user && (
                        <Link href={`/auction/${a.id}`}>
                          <a className='btn btn-outline btn-sm'>View Auction</a>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {!auctions?.length && (
          <div className='justify-center rounded-lg alert bg-base-100'>
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
              <span>No auctions available right now!</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
