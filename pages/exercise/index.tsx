import { useTranslation } from 'next-i18next';
import React from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps } from 'next';
import { getServerSideTranslations } from 'utils/localization';
import dynamic from 'next/dynamic';

const ExerciseOrchestrator = dynamic(
  () => import('components/basecomponents/Exercise/ExerciseOrchestrator').then((mod) => mod.ExerciseOrchestrator),
  { ssr: false }
);

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
        <ExerciseOrchestrator />
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
