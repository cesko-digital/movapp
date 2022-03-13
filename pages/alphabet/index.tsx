import Head from 'next/head';
import React, { useState } from 'react';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { CZ_ALPHABET } from '../../data/alphabet';
export { getStaticProps } from '../../utils/localization';

const AlphabetPage = (): JSX.Element => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  //w-[241px] h-[350px]
  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <div className="grid gap-6 justify-center md:justify-start auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] w-full   py-5 sm:py-10 px-2 sm:px-4">
        {CZ_ALPHABET.map(({ main_letter, letter_transcription, examples }, index) => {
          return (
            <AlphabetCard
              player={player}
              setPlayer={setPlayer}
              key={index}
              examples={examples}
              mainLanguageLetter={main_letter}
              secondaryLanguageLetterTranscription={letter_transcription}
            />
          );
        })}
      </div>
    </>
  );
};

export default AlphabetPage;
