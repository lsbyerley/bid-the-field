import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { MenuAlt1Icon } from '@heroicons/react/outline';
import ThemeSwitch from '../ThemeSwitch';

const NavBar = () => {
  const { data: session, status: sessionStatus } = useSession();
  const sessionLoading = sessionStatus === 'loading';

  console.log('LOG: session', session);

  return (
    <div className='navbar bg-base-200'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex='0' className='btn btn-ghost lg:hidden'>
            <MenuAlt1Icon className='w-5 h-5' />
          </label>
          <ul
            tabIndex='0'
            className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52'
          >
            <li>
              <Link href='/about'>
                <a>About</a>
              </Link>
            </li>
          </ul>
        </div>
        <Link href='/'>
          <a className='text-xl normal-case btn btn-ghost'>Bid The Field</a>
        </Link>
      </div>
      <div className='hidden navbar-center lg:flex'>
        <ul className='p-0 menu menu-horizontal'>
          <li>
            <Link href='/about'>
              <a>About</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className='navbar-end'>
        <ThemeSwitch />
        {!sessionLoading && !session && (
          <div>
            <Link href='/auth/signin'>
              <a className='ml-4 btn btn-sm'>Sign in</a>
            </Link>
          </div>
        )}
        {!sessionLoading && session && (
          <div className='dropdown dropdown-end'>
            <label tabIndex='0' className='btn btn-ghost btn-circle avatar'>
              <div className='w-10 rounded-full'>
                <img
                  referrerPolicy='no-referrer'
                  src={session?.user?.image || 'https://place-hold.it/40x40'}
                />
              </div>
            </label>
            <ul
              tabIndex='0'
              className='p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52'
            >
              <li className='menu-title'>
                <div>{session?.user?.email || 'no email'}</div>
              </li>
              <li>
                <a
                  className=' active:bg-gray-500'
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
