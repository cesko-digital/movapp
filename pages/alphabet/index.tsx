import { useLanguage } from 'utils/useLanguageHook';
import { Trans, useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { LanguageSelect } from '../../components/basecomponents/LanguageSelect';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant, Language } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { AlphabetDataObject, fetchAlphabetMain, fetchAlphabetUk } from '../../utils/getDataUtils';
import { getServerSideTranslations } from '../../utils/localization';
import { handleDownloadPdfs } from 'utils/handleDownloadPdfs';
import { usePlausible } from 'next-plausible';

const countryVariant = getCountryVariant();

const AlphabetPage = ({ alphabetMain, alphabetUk }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const { otherLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedAlphabet, setSelectedAlphabet] = useState<Language>(otherLanguage);

  const alphabet = selectedAlphabet === 'uk' ? alphabetUk : alphabetMain;

  const { currentLanguage } = useLanguage();

  const plausible = usePlausible();
  const filePathAlfabet = `/pdf/${selectedAlphabet}Alphabet.pdf`;

  return (
    <>
      <SEO
        title={t(`seo.alphabet_page_title.${getCountryVariant()}`)}
        description={t(`seo.alphabet_page_description.${getCountryVariant()}`)}
      />
      <div>
        <div className="max-w-7xl m-auto">
          <h1 className="text-primary-blue mb-3">{t(`alphabet_page.${selectedAlphabet}.name`)}</h1>
          <p className="text-base md:text-xl">{t(`alphabet_page.${selectedAlphabet}.description`)}</p>
          <p className="text-base md:text-xl">
            <Trans
              i18nKey={'alphabet_page.download'}
              components={[
                <a
                  key="download PDF"
                  className="underline text-primary-blue"
                  href={filePathAlfabet}
                  rel="noreferrer"
                  target="_blank"
                  onClick={() => {
                    handleDownloadPdfs(plausible, currentLanguage, filePathAlfabet, 'alphabet');
                  }}
                />,
              ]}
            />
          </p>
          <div className="w-full  my-5 ">
            <LanguageSelect
              onClick={() => setSelectedAlphabet(countryVariant)}
              active={selectedAlphabet === countryVariant}
              label={t(`alphabet_page.${countryVariant}.name`)}
            />

            <LanguageSelect
              onClick={() => setSelectedAlphabet('uk')}
              active={selectedAlphabet === 'uk'}
              label={t(`alphabet_page.uk.name`)}
            />
          </div>
          <div className="grid gap-6 justify-center auto-rows-[400px] sm:auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(275px,275px))] sm:grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] ">
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

export const getStaticProps: GetStaticProps<{ alphabetMain: AlphabetDataObject; alphabetUk: AlphabetDataObject }> = async ({ locale }) => {
  const alphabetMain = await fetchAlphabetMain();
  const alphabetUk = await fetchAlphabetUk();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      alphabetMain,
      alphabetUk,
      ...localeTranslations,
    },
  };
};

export default AlphabetPage;
