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
import PlausibleProvider from 'next-plausible';
import { CountryVariant, getCountryVariant } from '../utils/locales';

export const PLAUSIBLE_DOMAINS: Record<CountryVariant, string> = {
  cs: 'movapp.cz, all.movapp.eu',
  sk: 'sk.movapp.eu, all.movapp.eu',
  pl: 'pl.movapp.eu, all.movapp.eu',
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { locales, asPath } = useRouter();
  return (
    <PlausibleProvider domain={PLAUSIBLE_DOMAINS[getCountryVariant()]}>
      <Head>
        <link rel="alternate" hrefLang="x-default" href={`https://www.movapp.cz${asPath}`} />
        {locales?.map((locale, index) => {
          return <link key={index} rel="alternate" hrefLang={locale} href={`https://www.movapp.cz/${locale}${asPath}`} />;
        })}
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlausibleProvider>
  );
};

export default appWithTranslation(MyApp);
