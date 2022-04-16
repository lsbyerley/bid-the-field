import NavBar from '../NavBar';

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col min-h-screen grid-bg'>
      <NavBar />
      <main className='flex-1'>{children}</main>
      <footer className='flex items-center justify-center py-8 bg-base-200'>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Bid The Field{' '}
        </a>
      </footer>
    </div>
  );
};

export default Layout;
