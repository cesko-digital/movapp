import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import StoriesList from 'components/basecomponents/Story/StoriesList';
import SEO from 'components/basecomponents/SEO';
import stories from 'data/stories';
import { getCountryVariant } from 'utils/locales';
import Custom404 from 'pages/404';

import { Story } from '@types';
interface StoriesSectionProps {
  stories: Story[];
}

export interface Language {
  cs: string;
  uk: string;
  sk?: string;
  [index: string]: string | undefined;
}

const StoriesSection = ({ stories }: StoriesSectionProps) => {
  const { t } = useTranslation();
  const countryVariant = getCountryVariant();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_storiesTitle.${getCountryVariant()}`)}
        description={t(`seo.kids_page_storiesDescription.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      {countryVariant === 'cs' || countryVariant === 'sk' ? (
        <div className="min-h-screen m-auto py-10 px-2 sm:px-4">
          <StoriesList stories={stories} />
        </div>
      ) : (
        <Custom404 />
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: { stories, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoriesSection;
