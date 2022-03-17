import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/sections/Layout/Layout';
import { appWithTranslation } from 'next-i18next';

import '@fontsource/roboto/900.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/700-italic.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default appWithTranslation(MyApp);
