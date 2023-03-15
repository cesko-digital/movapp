/* eslint-disable no-console */
import React, { ReactNode } from 'react';
//import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { fetchDictionary } from 'utils/getDataUtils';
import { Language, getCountryVariant } from 'utils/locales';
import { ExerciseOrchestrator } from 'components/basecomponents/Exercise/ExerciseOrchestrator';
import SEO from 'components/basecomponents/SEO';
import { useTranslation } from 'next-i18next';
import { getServerSideTranslations } from 'utils/localization';

interface StoriesProps {
  story: string | undefined;
}

interface UrlParams extends ParsedUrlQuery {
  categoryId: string;
}

const ExerciseComponent = ({ story }: { story: string }): ReactNode => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)} //TO DO: someone write these SEO textations
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        <ExerciseOrchestrator categories={[story]} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<UrlParams> = async () => {
  const dictionary = await fetchDictionary();
  const paths: { params: { categoryId: string }; locale: Language }[] = [];
  const categoriesIds = dictionary.categories.map((category) => category.id);

  categoriesIds.forEach((id) => {
    paths.push({
      params: { categoryId: id },
      locale: 'uk',
    });
    paths.push({
      params: { categoryId: id },
      locale: getCountryVariant(),
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<StoriesProps, UrlParams> = async ({ params, locale }) => {
  const story = params?.categoryId.toString();
  const localeTranslations = await getServerSideTranslations(locale);
  //example id rec0Web8t9flE9V4Y, "recNz2QdaDsWOMBmO"

  return {
    props: { story, ...localeTranslations },
  };
};

export default ExerciseComponent;
