import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState } from 'react';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { ALPHABET_CZ } from '../../data/alphabets/cz_alphabet';
import { ALPHABET_UA } from '../../data/alphabets/ua_alphabet';
export { getStaticProps } from '../../utils/localization';

const AlphabetPage = (): JSX.Element => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { i18n } = useTranslation();

  const alphabet = i18n.language === 'cz' ? ALPHABET_UA : ALPHABET_CZ;

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <div
        role={'button'}
        className="grid gap-6 justify-center md:justify-start auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] w-full   py-5 sm:py-10 px-2 sm:px-4"
      >
        {alphabet.map(({ examples, letter, transcription }, index) => {
          return (
            <AlphabetCard
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
    </>
  );
};

export default AlphabetPage;
