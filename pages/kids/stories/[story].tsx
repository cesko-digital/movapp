import React from 'react';
import { useTranslation } from 'next-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import SEO from 'components/basecomponents/SEO';
import StoryReader from '../../../components/basecomponents/StoryReader';
import stories from './stories';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Story } from './index';

interface StoriesProps {
  story: Story;
}

interface UrlParams extends ParsedUrlQuery {
  story: string;
}

const StoriesContainer = ({ story }: StoriesProps): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const title = story.title[currentLanguage];

  const { t } = useTranslation();
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
  const paths = stories.map((story) => ({
    params: { story: story.slug },
  }));

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
