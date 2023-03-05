import Link from 'next/link';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Bars3Icon } from '@heroicons/react/24/outline';
import ThemeSwitch from '../ThemeSwitch';

const NavBar = () => {
  const router = useRouter();
  const { isLoading, session, error } = useSessionContext();
  const supabaseClient = useSupabaseClient();

  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex={0} className='btn btn-sm btn-ghost lg:hidden'>
            <Bars3Icon className='w-5 h-5' />
          </label>
          <ul
            tabIndex={0}
            className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
          >
            <li>
              <Link href='/' className='active:bg-base-300'>
                Home
              </Link>
              <Link href='/profile' className='active:bg-base-300'>
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <Link href='/' className='normal-case md:text-lg btn btn-sm btn-ghost'>
          Bid The Field
        </Link>
      </div>
      <div className='hidden navbar-center lg:flex'>
        {/*<ul className='p-0 menu menu-horizontal'>
          <li>
            <Link href='/about'>
              <a className='btn btn-ghost'>About</a>
            </Link>
          </li>
</ul>*/}
      </div>
      <div className='navbar-end'>
        <ThemeSwitch />
        {!isLoading && !session && (
          <button
            className='ml-4 btn btn-sm'
            onClick={(e) => {
              e.preventDefault();
              return supabaseClient.auth.signInWithOAuth({
                provider: 'google',
              });
            }}
          >
            Sign In
          </button>
        )}
        {!isLoading && session && (
          <div className='ml-2 md:ml-4 dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <div className='w-8 rounded-full md:w-10'>
                <img
                  referrerPolicy='no-referrer'
                  src={
                    session.user?.user_metadata?.picture ||
                    'https://place-hold.it/40x40'
                  }
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
            >
              <li className='menu-title'>
                <div>
                  {session.user?.user_metadata?.name ||
                    session.user?.user_metadata?.email ||
                    'n/a'}
                </div>
              </li>
              <li>
                <Link href='/profile' className='active:bg-gray-90'>
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    router.push('/');
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
