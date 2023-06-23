import { useTranslation } from 'next-i18next';
import React from 'react';
import { getCountryVariant } from 'utils/locales';
import SEO from 'components/basecomponents/SEO';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';
import Quiz from 'components/basecomponents/QuizGame/Quiz';

const ImageQuizSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <div className="h-screen bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_imagequiz_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_imagequiz_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <article className="flex flex-col h-screen items-center space-y-4 py-4">
        <Quiz dictionary={dictionary} />
      </article>
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

export default ImageQuizSection;
