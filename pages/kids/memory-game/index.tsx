import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';
import kidsWords from 'data/translations/pro-deti.json';
import dynamic from 'next/dynamic';
export { getStaticProps } from 'utils/localization';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), { ssr: false });

const normalizeData = ({ ua_translation, cz_translation, image }: { ua_translation: string; cz_translation: string; image: string }) => ({
  translation: {
    uk: ua_translation,
    cs: cz_translation,
  },
  image,
});

// shuffle array then pick 8 elements
const cardsData = kidsWords
  .sort(() => Math.random() - 0.5)
  .slice(0, 8)
  .map(normalizeData);

const MemoryGameSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>{t('seo.dictionary_page_title')}</title>
        <meta name="description" content={t('seo.dictionary_page_description')} />
        <meta name="twitter:title" content={t('seo.dictionary_page_title')} />
      </Head>
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        <MemoryGame cardsData={cardsData} />
      </div>
    </div>
  );
};

export default MemoryGameSection;
