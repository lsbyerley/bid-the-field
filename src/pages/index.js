import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { supabase } from '../util/supabaseClient';
import { isAuctionOver } from '../util/auctionUtils';

// https://www.masters.com/en_US/scores/feeds/2022/scores.json

export async function getServerSideProps({ params }) {
  const { data, error } = await supabase.from('Auctions').select();

  if (error) {
    console.log(error.message);
  }

  return {
    props: {
      auctions: data,
    },
  };
}

export default function Home({ auctions = [] }) {
  const { data: session, status: sessionStatus } = useSession();
  const sessionLoading = sessionStatus === 'loading';

  return (
    <Layout>
      <Head>
        <title>Bid The Field</title>
      </Head>
      <div className='hero'>
        <div className='text-center hero-content'>
          <div className='max-w-md'>
            <h1 className='mb-4 text-5xl font-bold'>Bid The Field</h1>
            <p className='pt-2'>Join an auction and bid on players or teams</p>
            {!sessionLoading && !session && (
              <p className='pt-2'>
                You must have a google account to sign in and place bids
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='max-w-2xl pt-8 pb-24 mx-auto sm:pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='grid grid-cols-1 mt-6 md:grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 md:gap-y-0 lg:gap-x-8'>
          {auctions.map((a) => {
            const auctionOver = isAuctionOver(a);
            return (
              <div key={a.id} className='relative shadow card bg-base-200'>
                {auctionOver && (
                  <div className='absolute badge badge-error badge-outline top-5 right-5'>
                    Bidding Over
                  </div>
                )}
                {!auctionOver && (
                  <div className='absolute badge badge-success badge-outline top-5 right-5'>
                    In Progress
                  </div>
                )}
                <div className='card-body'>
                  <h2 className='card-title'>{a.name}</h2>
                  <p className='py-6'>{a?.description || '-'}</p>
                  <div className='justify-center card-actions'>
                    {!sessionLoading && !session && (
                      <Link href='/auth/signin'>
                        <a className='btn btn-outline btn-sm'>Sign In To Bid</a>
                      </Link>
                    )}
                    {!sessionLoading && session && (
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
      </div>
    </Layout>
  );
}
