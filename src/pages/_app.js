import '../styles/globals.css';
import AppContextProvider from '../providers/AppContextProvider';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { usePanelbear } from '@panelbear/panelbear-nextjs';
import Modal from '../components/Modal';

function MyApp({ Component, pageProps }) {
  usePanelbear(process.env.NEXT_PUBLIC_PANELBEAR_ID);
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
