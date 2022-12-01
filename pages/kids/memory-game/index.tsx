import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGameThemeLoader'), {
  ssr: false,
});

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const phrases = useMemo(() => getKidsCategory(dictionary)?.translations || [], [dictionary]);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_memorygame_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_memorygame_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <MemoryGame phrases={phrases} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default MemoryGameSection;
