import NavBar from '../NavBar';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen bg-base-200'>
      <NavBar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
