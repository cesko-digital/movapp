import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState } from 'react';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { LanguageSelect } from '../../components/basecomponents/LanguageSelect';
import { ALPHABET_CZ } from '../../data/alphabets/cz_alphabet';
import { ALPHABET_UA } from '../../data/alphabets/ua_alphabet';
export { getStaticProps } from '../../utils/localization';

const AlphabetPage = (): JSX.Element => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { i18n, t } = useTranslation();
  const [swapLanguage, setSwapLanguage] = useState<'cz-ua' | 'ua-cz'>(i18n.language === 'cs' ? 'ua-cz' : 'cz-ua');

  const alphabet = swapLanguage === 'cz-ua' ? ALPHABET_CZ : ALPHABET_UA;

  const playerLanguage = swapLanguage === 'cz-ua' ? 'cs' : 'uk';

  const cz_ua_select = i18n.language === 'cs' ? 'Česká abeceda' : 'Чеський алфавіт';

  const ua_cz_select = i18n.language === 'cs' ? 'Ukrajinská abeceda' : 'Український алфавіт';

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>{t('seo.alphabet_page_title')}</title>
        <meta name="description" content={t('seo.alphabet_page_description')} />
        <meta name="twitter:title" content={t('seo.alphabet_page_title')} />
      </Head>
      <div className="max-w-7xl m-auto">
        <h1 className="text-primary-blue mb-3">
          {t('alphabet_page.title', {
            ua_version: swapLanguage === 'ua-cz' ? 'Український' : 'Чеський',
            cz_version: swapLanguage === 'ua-cz' ? 'Ukrajinská' : 'Česká',
          })}
        </h1>
        <p className="text-base md:text-xl">
          {t('alphabet_page.description', {
            cz_version_description:
              swapLanguage === 'ua-cz'
                ? 'Naučte se ukrajinskou abecedu. Nazývá se také ukrajinská cyrilice nebo ukrajinská azbuka. Obsahuje 33 znaků.'
                : 'Naučte se českou abecedu. Tvoří ji 26 písmen latinské abecedy doplněných třemi diakritickými znaménky.',
            ua_version_description:
              swapLanguage === 'ua-cz'
                ? 'Вивчіть український алфавіт. Він складається із 33 літер.'
                : 'Вивчіть чеський алфавіт. Він складається з 26 літер латинського алфавіту, доповнених трьома діакритичними знаками.',
          })}
        </p>
        <div className="w-full  my-5 ">
          <LanguageSelect onClick={() => setSwapLanguage('cz-ua')} active={swapLanguage === 'cz-ua'} languages={cz_ua_select} />
          <LanguageSelect onClick={() => setSwapLanguage('ua-cz')} active={swapLanguage === 'ua-cz'} languages={ua_cz_select} />
        </div>
        <div className="grid gap-6  justify-center auto-rows-[400px] sm:auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(275px,275px))] sm:grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] ">
          {alphabet.map(({ examples, letter, transcription }, index) => {
            return (
              <AlphabetCard
                playerLanguage={playerLanguage}
                letter={letter}
                transcription={transcription}
                examples={examples}
                key={index}
                player={player}
                setPlayer={setPlayer}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AlphabetPage;
