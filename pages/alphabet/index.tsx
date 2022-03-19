import { useTranslation } from "next-i18next";
import Head from "next/head";
import React, { useState } from "react";
import { AlphabetCard } from "../../components/basecomponents/AlphabetCard";
import { LanguageSelect } from "../../components/basecomponents/LanguageSelect";
import ALPHABET_CZ from "../../data/alphabets/cz_alphabet.json";
import ALPHABET_UA from "../../data/alphabets/ua_alphabet.json";
export { getStaticProps } from "../../utils/localization";

const AlphabetPage = (): JSX.Element => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { i18n } = useTranslation();
  const [swapLanguage, setSwapLanguage] = useState<"cz-ua" | "ua-cz">(i18n.language === "cs" ? "ua-cz" : "cz-ua");

  const alphabet = swapLanguage === "cz-ua" ? ALPHABET_CZ : ALPHABET_UA;

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
      <div className="max-w-7xl m-auto py-5 sm:py-10 ">
        <div className="w-full  mb-5 text-center">
          <LanguageSelect onClick={() => setSwapLanguage("cz-ua")} active={swapLanguage === "cz-ua"} languages={["cz", "ua"]} />
          <LanguageSelect onClick={() => setSwapLanguage("ua-cz")} active={swapLanguage === "ua-cz"} languages={["ua", "cz"]} />
        </div>
        <div className="grid gap-6  justify-center auto-rows-[400px] sm:auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(275px,275px))] sm:grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] ">
          {alphabet.map(({ examples, letter, transcription }, index) => {
            return (
              <AlphabetCard
                letter={letter as [string, string | null]}
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
