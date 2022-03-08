import { useTranslation } from 'next-i18next';
import type { NextPage } from 'next';
import Head from 'next/head';
export { getStaticProps } from '../utils/localization';

const Home: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('seo.homepage_page_title')}</title>
        <meta name="description" content={t('seo.homepage_page_description')} />
        <meta name="twitter:title" content={t('seo.homepage_page_title')} />
      </Head>
      <div className="max-w-3xl m-auto">
      </div>
    </>
  );
};

export default Home;
