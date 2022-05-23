import React, { ReactNode } from 'react';
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
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -m-2 sm:-m-5 p-12">
      <SEO
        title={t('seo.kids_page_title')}
        description={t('seo.kids_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="px-6 py-4 flex rounded-2xl overflow-hidden shadow-xl bg-white md:w-4/5 m-auto">
        <StoryReader language={currentLanguage} title={title} id={story.slug} />
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
