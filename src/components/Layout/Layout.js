import Link from 'next/link';
import NavBar from '../NavBar';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-base-200 grid-bg'>
      <NavBar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
