import Link from 'next/link';
import NavBar from '../NavBar';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-base-200 grid-bg'>
      <NavBar />
      <main className='flex-1'>{children}</main>
      <footer className='flex items-center justify-center py-8 bg-base-100'>
        <Link href='/'>
          <a>Bid The Field</a>
        </Link>
      </footer>
    </div>
  );
};

export default Layout;
