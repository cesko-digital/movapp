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

import KioskLayout from './kiosk/KioskLayout';
export const PLAUSIBLE_DOMAINS: Record<CountryVariant, string> = {
  cs: 'movapp.cz, all.movapp.eu',
  sk: 'sk.movapp.eu, all.movapp.eu',
  pl: 'pl.movapp.eu, all.movapp.eu',
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { locales, asPath } = useRouter();
  const router = useRouter();

  const wrapComponentWithLayout = () => {
    if (router.asPath.includes('pdf')) {
      return <Component {...pageProps} />;
    } else if (router.asPath.includes('kiosk')) {
      return (
        <KioskLayout>
          <Component {...pageProps} />
        </KioskLayout>
      );
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };

  return (
    // If you need to debug Plausible on localhost then add 'trackLocalhost' and 'enabled' attributes to PlausibleProvider:
    // <PlausibleProvider ... trackLocalhost enabled>
    // But never commit it into main branch!
    // See docs https://www.npmjs.com/package/next-plausible for more
    <PlausibleProvider domain={PLAUSIBLE_DOMAINS[getCountryVariant()]}>
      <Head>
        <meta name="apple-itunes-app" content="app-id=1617768476" />
        <link rel="alternate" hrefLang="x-default" href={`https://www.movapp.cz${asPath}`} />
        {locales?.map((locale, index) => {
          return <link key={index} rel="alternate" hrefLang={locale} href={`https://www.movapp.cz/${locale}${asPath}`} />;
        })}
      </Head>
      {wrapComponentWithLayout()}
    </PlausibleProvider>
  );
};

export default appWithTranslation(MyApp);
