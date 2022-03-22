import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState } from 'react';
import kidsWords from '../../data/translations/pro-deti.json';
import { Button } from '../../components/basecomponents/Button';
import { KidsTranslationsContainer } from '../../components/basecomponents/KidsTranslationContainer';
export { getStaticProps } from '../../utils/localization';

const KidsSection = () => {
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
      <div className="text-center sm:text-right pt-8 mr-0 sm:mr-16">
        <a href="/omalovanky.pdf" target="_blank" rel="noopener noreferrer" download>
          <Button text={t('kids_page.downloadPDF')} />
        </a>
      </div>
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        {kidsWords.map((word, index) => {
          return <KidsTranslationsContainer key={index} {...word} setPlayer={setPlayer} player={player} />;
        })}
      </div>
    </div>
  );
};

export default KidsSection;
