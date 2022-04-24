import { useLanguage } from 'utils/useLanguageHook';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { AlphabetCard } from '../../components/basecomponents/AlphabetCard';
import { LanguageSelect } from '../../components/basecomponents/LanguageSelect';
import SEO from 'components/basecomponents/SEO';
import { ALPHABET_CZ } from 'data/alphabets/CZ/cz_alphabet';
import { ALPHABET_UA } from 'data/alphabets/CZ/ua_alphabet';
import { CountryVariant, getCountryVariant, Language } from 'utils/locales';
import { ALPHABET_SK } from 'data/alphabets/SK/sk_alphabet';
import { Letter } from 'data/alphabets/alphabetTypes';
export { getStaticProps } from '../../utils/localization';

const countryVariant = getCountryVariant();

const ALPHABETS: Record<CountryVariant, Letter[]> = {
  cs: ALPHABET_CZ,
  sk: ALPHABET_SK,
  pl: ALPHABET_SK,
};

const AlphabetPage = (): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [selectedAlphabet, setSelectedAlphabet] = useState<Language>(currentLanguage);

  const alphabet = selectedAlphabet === 'uk' ? ALPHABET_UA : ALPHABETS[getCountryVariant()];

  return (
    <>
      <SEO
        title={t('seo.alphabet_page_title')}
        description={t('seo.alphabet_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
      <div className="max-w-7xl m-auto">
        <h1 className="text-primary-blue mb-3">{t(`alphabet_page.${selectedAlphabet}.name`)}</h1>
        <p className="text-base md:text-xl">{t(`alphabet_page.${selectedAlphabet}.description`)}</p>
        <div className="w-full  my-5 ">
          <LanguageSelect
            onClick={() => setSelectedAlphabet(countryVariant)}
            active={selectedAlphabet === countryVariant}
            label={t(`alphabet_page.${countryVariant}.name`)}
          />
          <LanguageSelect onClick={() => setSelectedAlphabet('uk')} active={selectedAlphabet === 'uk'} label={t(`alphabet_page.uk.name`)} />
        </div>
        <div className="grid gap-6  justify-center auto-rows-[400px] sm:auto-rows-[300px] md:auto-rows-[350px] grid-cols-[repeat(auto-fill,minmax(275px,275px))] sm:grid-cols-[repeat(auto-fill,minmax(205px,205px))]  md:grid-cols-[repeat(auto-fill,minmax(240px,240px))] ">
          {alphabet.map(({ examples, letter, transcription }, index) => {
            return (
              <AlphabetCard language={selectedAlphabet} letter={letter} transcription={transcription} examples={examples} key={index} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AlphabetPage;
