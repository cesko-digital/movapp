import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ScrollToTop } from '../components/basecomponents/ScrollToTop';
import { Layout } from '../components/sections/Layout/Layout';
import { appWithTranslation } from 'next-i18next';

// Fonts import
import '@fontsource/roboto/200.css';
import '@fontsource/roboto/600.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/800.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <ScrollToTop />
    </Layout>
  );
};

export default appWithTranslation(MyApp);
