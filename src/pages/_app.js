import { useEffect } from 'react';
import '../styles/globals.css';
import AppContextProvider from '@/providers/AppContextProvider';
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { ThemeProvider } from 'next-themes';
import { usePanelbear } from '@panelbear/panelbear-nextjs';
import Modal from '@/components/Modal';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const MyApp = ({ Component, pageProps }) => {
  usePanelbear(process.env.NEXT_PUBLIC_PANELBEAR_ID);
  const router = useRouter();

  console.log('LOG: test', supabaseClient);

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
    <UserProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        <AppContextProvider>
          <Component {...pageProps} />
          <Modal />
        </AppContextProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default MyApp;
