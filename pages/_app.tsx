import 'styles/globals.css';
import 'styles/markdown.css';
import type { AppProps } from 'next/app';
import { Layout } from 'components/sections/Layout/Layout';
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
import { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next/types';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { locales, asPath } = useRouter();

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="alternate" hrefLang="x-default" href={`https://www.movapp.cz${asPath}`} />
        {locales?.map((locale, index) => {
          return <link key={index} rel="alternate" hrefLang={locale} href={`https://www.movapp.cz/${locale}${asPath}`} />;
        })}
      </Head>
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </>
  );
};

export default appWithTranslation(MyApp);
