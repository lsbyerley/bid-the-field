import { useState, useEffect } from 'react';
import '../styles/globals.css';
import AppContextProvider from '@/providers/AppContextProvider';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ThemeProvider } from 'next-themes';
import { usePanelbear } from '@panelbear/panelbear-nextjs';
import Modal from '@/components/Modal';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';

NProgress.configure({ showSpinner: false });

const MyApp = ({ Component, pageProps }) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  usePanelbear(process.env.NEXT_PUBLIC_PANELBEAR_ID);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
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
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps?.initialSession}
    >
      <ThemeProvider>
        <AppContextProvider>
          <Component {...pageProps} />
          <Modal />
        </AppContextProvider>
      </ThemeProvider>
      <Toaster />
    </SessionContextProvider>
  );
};

export default MyApp;
