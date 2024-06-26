import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { Layout, Placeholders } from '@/components';
import { hasAuctionStarted, isAuctionOver } from '@/lib/auctionUtils';

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Home() {
  const { isLoading, session, error } = useSessionContext();
  const supabaseClient = useSupabaseClient();
  const [auctions, setAuctions] = useState([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);

  const fetchAuctions = async () => {
    try {
      setAuctionsLoading(true);
      const { data, error } = await supabaseClient
        .from('auctions')
        .select()
        .order('start_date', { ascending: false });

      if (error) {
        setAuctionsLoading(false);
        return;
      }

      await wait(1000);
      setAuctions(data);
      setAuctionsLoading(false);
    } catch (error) {
      setAuctionsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [supabaseClient]);

  return (
    <Layout>
      <Head>
        <title>Bid The Field</title>
      </Head>
      <div className='hero'>
        <div className='pt-8 text-center hero-content'>
          <div className='max-w-md'>
            <h1 className='mb-4 text-3xl font-bold'>Bid The Field</h1>
            {/*<p className='pt-2'>
              This site is meant to function as an automated replacement for the
              excel spreadsheet auction/calcutta mayhem and is still under
              active development
            </p>
            <p className='pt-2'>
              Suggestions on improvement are encouraged &#129305;
            </p>*/}
            {!session && (
              <p className='pt-2'>
                You must have a google account to sign in and place bids
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='max-w-2xl px-2 py-4 mx-auto lg:max-w-7xl md:px-0'>
        <div className='grid grid-cols-1 gap-6 mt-6 md:grid-cols-3'>
          {auctionsLoading && <Placeholders number={6} />}
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
                      {!isLoading && !session && (
                        <button
                          className='btn btn-outline btn-sm'
                          onClick={(e) => {
                            e.preventDefault();
                            return supabaseClient.auth.signInWithOAuth({
                              provider: 'google',
                            });
                          }}
                        >
                          Sign In To Bid
                        </button>
                      )}
                      {!isLoading && session && (
                        <Link
                          href={`/auction/${a.id}`}
                          className='btn btn-outline btn-sm'
                        >
                          View Auction
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {!auctions?.length && !auctionsLoading && (
          <div className='justify-center rounded-lg alert bg-base-100'>
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
            <span>There are no auctions available.</span>
          </div>
        )}
      </div>
    </Layout>
  );
}
