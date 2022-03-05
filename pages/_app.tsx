import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ScrollToTop } from '../components/basecomponents/ScrollToTop';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <ScrollToTop />
    </>
  );
};

export default MyApp;
