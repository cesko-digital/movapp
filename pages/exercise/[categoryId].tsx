import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { fetchDictionary } from 'utils/getDataUtils';
import { Language, getCountryVariant } from 'utils/locales';
import { ExerciseOrchestrator } from 'components/basecomponents/Exercise/ExerciseOrchestrator';
import SEO from 'components/basecomponents/SEO';
import { useTranslation } from 'next-i18next';
import { getServerSideTranslations } from 'utils/localization';

interface UrlParams extends ParsedUrlQuery {
  categoryId: string;
}

const ExerciseComponent = ({ categoryId }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="bg-primary-grey -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)} //TO DO: someone write these SEO textations
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto">
        <ExerciseOrchestrator categories={[categoryId]} />
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

export const getStaticProps: GetStaticProps<{ categoryId: string }, UrlParams> = async ({ params, locale }) => {
  const categoryId = params?.categoryId.toString() ?? (await fetchDictionary()).categories[0].id;
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: { categoryId, ...localeTranslations },
  };
};

export default ExerciseComponent;