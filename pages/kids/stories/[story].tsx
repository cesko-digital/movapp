import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import SEO from 'components/basecomponents/SEO';
import StoryReader from '../../../components/basecomponents/StoryReader';
import stories from '../../../data/stories';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Story } from './index';
import { getCountryVariant, Language } from '../../../utils/locales';

interface StoriesProps {
  story: Story | undefined;
}

interface UrlParams extends ParsedUrlQuery {
  story: string;
}

const StoriesContainer = ({ story }: StoriesProps): ReactNode => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  if (!story) {
    return 'Story not found';
  }

  const title = story.title[currentLanguage];

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -m-2 sm:-m-5 md:p-12">
      <SEO title={t('seo.kids_page_title')} description={t('seo.kids_page_description')} image="https://www.movapp.cz/kids/hrad.png" />
      <p className="px-6 py-4 flex items-center overflow-hidden  md:w-4/5 m-auto">
        <Link href={`/`}>
          <a className="mr-2 hover:text-primary-blue">{t('kids_page.homepage')}</a>
        </Link>{' '}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>{' '}
        <Link href={`/kids/stories`}>
          <a className="ml-2 hover:text-primary-blue">{t('kids_page.stories')}</a>
        </Link>
      </p>
      <div className="px-6 py-4 flex rounded-2xl overflow-hidden shadow-xl bg-white md:w-4/5 m-auto">
        <StoryReader title={title} id={story.slug} country={story.country} />
      </div>
    </div>
  );
};
export const getStaticPaths: GetStaticPaths<UrlParams> = async () => {
  const paths: { params: { story: string }; locale: Language }[] = [];
  stories.forEach((story) => {
    paths.push({
      params: { story: story.slug },
      locale: 'uk',
    });
    paths.push({
      params: { story: story.slug },
      locale: getCountryVariant(),
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<StoriesProps, UrlParams> = async ({ params, locale }) => {
  const storyId = params?.story ?? '';
  const story = stories.find((s) => s.slug === storyId);

  return {
    props: { story, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoriesContainer;
