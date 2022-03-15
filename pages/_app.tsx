import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ScrollToTop } from '../components/basecomponents/ScrollToTop';
import { Layout } from '../components/sections/Layout/Layout';
import { appWithTranslation } from 'next-i18next';

import '@fontsource/roboto/900.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/700-italic.css';
import '@fontsource/roboto/300-italic.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/source-sans-pro/200.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/600.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <ScrollToTop />
    </Layout>
  );
};

export default appWithTranslation(MyApp);
