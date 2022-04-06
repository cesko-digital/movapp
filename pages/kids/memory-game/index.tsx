import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState } from 'react';
import kidsWords from '../../../data/translations/pro-deti.json';
import { Button } from '../../../components/basecomponents/Button';
import { KidsTranslationsContainer } from '../../../components/basecomponents/KidsTranslationContainer';
import MemoryGame from './MemoryGame';
export { getStaticProps } from '../../../utils/localization';

const cardsData = [
  { image: '/kids/auticka.svg' },
  { image: '/kids/mic.svg' },
  { image: '/kids/postel.svg' },
  { image: '/kids/zahrada.svg' },
  { image: '/kids/omalovanky.svg' },
  { image: '/kids/panenka.svg' },
  { image: '/kids/vlacky.svg' },
  { image: '/kids/hory.svg' },
];

const MemoryGameSection = () => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
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
