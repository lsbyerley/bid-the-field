import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import ThemeSwitch from '../ThemeSwitch';

const NavBar = () => {
  const { isLoading, user, error } = useUser();

  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex='0' className='btn btn-sm btn-ghost lg:hidden'>
            <MenuAlt1Icon className='w-5 h-5' />
          </label>
          <ul
            tabIndex='0'
            className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
          >
            <li>
              {/* <Link href='/about'>
                <a>About</a>
  </Link> */}
              <Link href='/'>
                <a className='active:bg-base-300'>Home</a>
              </Link>
            </li>
          </ul>
        </div>
        <Link href='/'>
          <a className='normal-case md:text-lg btn btn-sm btn-ghost'>
            Bid The Field
          </a>
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
        {!isLoading && !user && (
          <button
            className='ml-4 btn btn-sm'
            onClick={() => {
              supabaseClient.auth.signIn({ provider: 'google' });
            }}
          >
            Sign In
          </button>
        )}
        {!isLoading && user && (
          <div className='ml-2 md:ml-4 dropdown dropdown-end'>
            <label tabIndex='0' className='btn btn-ghost btn-circle avatar'>
              <div className='w-8 rounded-full md:w-10'>
                <img
                  referrerPolicy='no-referrer'
                  src={
                    user?.user_metadata?.picture ||
                    'https://place-hold.it/40x40'
                  }
                />
              </div>
            </label>
            <ul
              tabIndex='0'
              className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
            >
              <li className='menu-title'>
                <div>{user?.email || 'no email'}</div>
              </li>
              <li>
                <Link href='/api/auth/logout'>
                  <a className='active:bg-gray-500'>Logout</a>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
