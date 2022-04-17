import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Link from 'next/link';
// https://www.masters.com/en_US/scores/feeds/2022/scores.json
import { supabase } from '../util/supabaseClient';

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
        <div className='grid grid-cols-1 mt-6 md:grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 md:gap-y-0 lg:gap-x-8'>
          {auctions.map((a) => {
            return (
              <div key={a.id} className='shadow card bg-base-200'>
                <div className='card-body'>
                  <h2 className='card-title'>{a.name}</h2>
                  <p>{a?.description || '-'}</p>
                  <div className='justify-end card-actions'>
                    {!sessionLoading && !session && (
                      <Link href='/auth/signin'>
                        <a className='btn btn-ghost'>Sign In To Bid</a>
                      </Link>
                    )}
                    {!sessionLoading && session && (
                      <Link href={`/auction/${a.id}`}>
                        <a className='btn btn-ghost'>View Auction</a>
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
