import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useForm } from 'react-hook-form';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { getURL } from '@/lib/helpers';
import { useAppContext } from '@/AppContext';
import { ProfilePageProps } from '@/types';

const usernameRegex = /^[a-zA-Z0-9\s]+$/;
const phoneRegex = /^[0-9]{10}$/;

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

  const { user } = session;
  const userId = user.id;

  // Run queries with RLS on the server
  // TODO: setup RLS https://supabase.com/docs/guides/auth/managing-user-data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    props: {
      profile,
    },
  };
};

const Profile: NextPage = ({ profile }: ProfilePageProps) => {
  const { isDev } = useAppContext();
  const [locData, setLocData] = useState(null);
  const [locLoading, setLocDataLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { error, session } = useSessionContext();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    setLocDataLoading(true);
    fetch(`${getURL()}/api/location`)
      .then((res) => res.json())
      .then((data) => {
        setLocData(data);
      })
      .finally(() => {
        setLocDataLoading(false);
      });
  }, []);

  const formOptions = {
    defaultValues: {
      phone: profile?.phone,
      username: profile?.username,
    },
  };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isDirty, dirtyFields } = formState;

  const onSubmit = (data) => {
    if (!data.username || !data.username.match(usernameRegex)) {
      toast.error('Invalid username');
      return;
    }
    if (data.phone !== '' && !data.phone?.match(phoneRegex)) {
      toast.error('Invalid phone number');
      return;
    }
    updateProfile(data);
  };

  const updateProfile = async (formValues) => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({
        ...formValues,
      })
      .match({ id: user?.id });

    if (error) {
      toast.error('There was an error saving your profile');
      reset();
      return;
    }

    toast.success('Profile updated!');
    router.reload();
  };

  if (!profile) {
    return (
      <Layout>
        <div className='max-w-2xl pt-8 pb-24 mx-auto sm:pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
          <div className='shadow-lg alert'>
            <ExclamationCircleIcon
              className='flex-shrink-0 w-6 h-6 stroke-info'
              aria-hidden='true'
            />
            <span>
              Profile not found! It may not exist or you do not have access to
              this profile.
            </span>

            <div className='flex-none'>
              <Link href='/' className='btn btn-sm'>
                Home
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
        <title>Profile - Bid The Field</title>
      </Head>
      <div className='py-12 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex justify-center items-center mb-2'>
            <div className='hidden invisible'>{JSON.stringify(locData)}</div>
            {(isDev || (locData?.city && locData?.region)) && (
              <span className='ml-2'>
                👋 {locData.city || '--'}, {locData.region || '--'}
              </span>
            )}
          </div>

          <div className='px-4 py-12 overflow-hidden shadow bg-base-100 sm:rounded-lg sm:px-6 lg:px-8'>
            {/** START FORM */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-8 divide-y divide-gray-200'
            >
              <div className='space-y-8 divide-y divide-gray-200 sm:space-y-5'>
                <div className=''>
                  <div>
                    <h3 className='text-lg font-medium leading-6'>Profile</h3>
                    <p className='max-w-2xl mt-1 text-sm '>
                      Your username or email will be displayed publicly to show
                      winning bids.
                    </p>
                  </div>
                  <div className='mt-6 space-y-6 sm:mt-5 sm:space-y-5'>
                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='username'
                        className='block text-sm font-medium sm:mt-px sm:pt-2'
                      >
                        Username
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <input
                          {...register('username')}
                          type='text'
                          name='username'
                          id='username'
                          autoComplete='family-name'
                          className='w-full max-w-lg input input-bordered'
                        />
                      </div>
                    </div>

                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium sm:mt-px sm:pt-2'
                      >
                        Email address
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <input
                          value={profile?.email || ''}
                          disabled
                          id='email'
                          name='email'
                          type='email'
                          autoComplete='email'
                          className='w-full max-w-lg input input-bordered'
                        />
                      </div>
                    </div>

                    <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5'>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-medium sm:mt-px sm:pt-2'
                      >
                        Phone Number
                      </label>
                      <div className='mt-1 sm:mt-0 sm:col-span-2'>
                        <input
                          {...register('phone')}
                          type='text'
                          name='phone'
                          id='phone'
                          autoComplete='tel-local'
                          className='w-full max-w-lg input input-bordered'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/*<div className='pt-8 space-y-6 divide-y divide-gray-200 sm:pt-10 sm:space-y-5'>
                  <div>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>
                      Notifications
                    </h3>
                    <p className='max-w-2xl mt-1 text-sm text-gray-500'>
                      We'll let you know about important happenings during an
                      auction.
                    </p>
                  </div>
                  <div className='space-y-6 divide-y divide-gray-200 sm:space-y-5'>
                    <div className='pt-6 sm:pt-5'>
                      <div role='group' aria-labelledby='label-email'>
                        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline'>
                          <div>
                            <div
                              className='text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700'
                              id='label-email'
                            >
                              By Email
                            </div>
                          </div>
                          <div className='mt-4 sm:mt-0 sm:col-span-2'>
                            <div className='max-w-lg space-y-4'>
                              <div className='relative flex items-start'>
                                <div className='flex items-center h-5'>
                                  <input
                                    id='outbidNotify'
                                    name='outbidNotify'
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                  />
                                </div>
                                <div className='ml-3 text-sm'>
                                  <label
                                    htmlFor='outbidNotify'
                                    className='font-medium text-gray-700'
                                  >
                                    Outbid
                                  </label>
                                  <p className='text-gray-500'>
                                    Get notified when you are outbid on a player
                                    or team
                                  </p>
                                </div>
                              </div>
                              <div className='relative flex items-start'>
                                <div className='flex items-center h-5'>
                                  <input
                                    id='thirtyMinWarning'
                                    name='thirtyMinWarning'
                                    type='checkbox'
                                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                                  />
                                </div>
                                <div className='ml-3 text-sm'>
                                  <label
                                    htmlFor='thirtyMinWarning'
                                    className='font-medium text-gray-700'
                                  >
                                    30 Minute Warning
                                  </label>
                                  <p className='text-gray-500'>
                                    Get notified when 30 minutes are left in an
                                    auction.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='pt-6 sm:pt-5'>
                      <div role='group' aria-labelledby='label-notifications'>
                        <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline'>
                          <div>
                            <div
                              className='text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700'
                              id='label-notifications'
                            >
                              Push Notifications
                            </div>
                          </div>
                          <div className='sm:col-span-2'>
                            <div className='max-w-lg'>
                              <p className='text-sm text-gray-500'>
                                These are delivered via SMS to your mobile
                                phone.
                              </p>
                              <div className='mt-4 space-y-4'>
                                <div className='flex items-center'>
                                  <input
                                    id='push-everything'
                                    name='push-notifications'
                                    type='radio'
                                    className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                                  />
                                  <label
                                    htmlFor='push-everything'
                                    className='block ml-3 text-sm font-medium text-gray-700'
                                  >
                                    Everything
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='push-email'
                                    name='push-notifications'
                                    type='radio'
                                    className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                                  />
                                  <label
                                    htmlFor='push-email'
                                    className='block ml-3 text-sm font-medium text-gray-700'
                                  >
                                    Same as email
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='push-nothing'
                                    name='push-notifications'
                                    type='radio'
                                    className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                                  />
                                  <label
                                    htmlFor='push-nothing'
                                    className='block ml-3 text-sm font-medium text-gray-700'
                                  >
                                    No push notifications
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  </div>*/}
              </div>

              <div className='pt-5'>
                <div className='flex justify-end'>
                  {/*<button
                    type='button'
                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  >
                    Cancel
  </button>*/}
                  <button
                    type='submit'
                    disabled={!isDirty}
                    className='inline-flex justify-center btn btn-outline btn-info'
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>

            {/** END FORM */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
