import { useTranslation } from 'next-i18next';
import React from 'react';
import { Language } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getServerSideTranslations } from '../../utils/localization';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { AlphabetDataObject, fetchAlphabetMain, fetchAlphabetUk } from '../../utils/getDataUtils';

const AlphabetPage = ({ alphabet }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const { t } = useTranslation();
  const alphabetCode: Language = alphabet.source;

  return (
    <>
      <div>
        <div className="max-w-7xl m-auto">
          <h1 className="text-primary-blue mb-3">{t(`alphabet_page.${alphabetCode}.name`)}</h1>
          <p className="text-base md:text-xl">{t(`alphabet_page.${alphabetCode}.description`)}</p>
          <div className="grid gap-6  justify-center auto-rows-[400px] sm:auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(275px,275px))] sm:grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] ">
            {alphabet.data.map(({ examples, letters, transcription, sound_url }, index) => {
              return (
                <AlphabetCard letters={letters} transcription={transcription} examples={examples} key={index} letterSoundUrl={sound_url} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ alphabet: AlphabetDataObject }> = async ({ locale, params }) => {
  let alphabet: AlphabetDataObject;
  console.log(params);
  if (params?.alphabet === 'uk') {
    alphabet = await fetchAlphabetUk();
  } else {
    alphabet = await fetchAlphabetMain();
  }

  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      alphabet,
      ...localeTranslations,
    },
  };
};

AlphabetPage.skipLayout = true;

export default AlphabetPage;
