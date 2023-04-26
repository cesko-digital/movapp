import { useTranslation } from 'next-i18next';
import React from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps } from 'next';
import { getServerSideTranslations } from 'utils/localization';
import { ExerciseOrchestrator } from 'components/basecomponents/Exercise/ExerciseOrchestrator';

const ExerciseSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-primary-grey -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)} //TO DO: someone write these SEO textations
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto">
        <ExerciseOrchestrator categories={['recdabyHkJhGf7U5D']} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      ...localeTranslations,
    },
  };
};

export default ExerciseSection;
