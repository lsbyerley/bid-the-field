import { useEffect } from 'react';
import '../styles/globals.css';
import AppContextProvider from '../providers/AppContextProvider';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePanelbear } from '@panelbear/panelbear-nextjs';
import Modal from '../components/Modal';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }) {
  usePanelbear(process.env.NEXT_PUBLIC_PANELBEAR_ID);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <ThemeProvider>
      <SessionProvider session={pageProps?.session}>
        <AppContextProvider>
          <Component {...pageProps} />
          <Modal />
        </AppContextProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
