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
import { Story } from '@types';
import { getCountryVariant, Language } from '../../../utils/locales';
import Custom404 from '../../404';
import { StoryPhrase, getStoryData } from '../../../components/basecomponents/Story/storyStore';

interface StoriesProps {
  story: Story | undefined;
  phrases: StoryPhrase[];
}

interface UrlParams extends ParsedUrlQuery {
  story: string;
}

const StoriesContainer = ({ story, phrases }: StoriesProps): ReactNode => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const { t } = useTranslation();

  if (!story) {
    return 'Story not found';
  }

  if (!story.title[currentLanguage] || !story.title[otherLanguage]) {
    return null;
  }

  const title_current = story.title[currentLanguage] || '';
  const title_other = story.title[otherLanguage] || '';
  const image_current_story = story.slug;

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -mt-2 md:p-12 w-full">
      <SEO
        title={`${title_current + ' - '}` + t(`seo.kids_page_storiesTitle.${getCountryVariant()}`)}
        description={t(`seo.kids_page_storiesDescription.${getCountryVariant()}`)}
        image={`https://www.movapp.cz/kids/ + ${image_current_story} + '.jpg'`}
      />
      {['cs', 'sk'].includes(getCountryVariant()) ? (
        <>
          <p className="px-6 py-4 flex items-center overflow-hidden  md:w-4/5 m-auto">
            <Link href={`/`} className="mr-2 hover:text-primary-blue">
              {t('kids_page.homepage')}
            </Link>{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>{' '}
            <Link href={`/kids/stories`} className="ml-2 hover:text-primary-blue">
              {t('kids_page.stories')}
            </Link>
          </p>
          <div className="px-6 py-4 flex rounded-2xl overflow-hidden shadow-xl bg-white md:w-4/5 m-auto">
            <StoryReader titleCurrent={title_current} titleOther={title_other} id={story.slug} country={story.country} phrases={phrases} />
          </div>
        </>
      ) : (
        <Custom404 />
      )}
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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const storyId = params?.story ?? '';
  const story = stories.find((s) => s.slug === storyId);
  const storyLocale = getCountryVariant();

  const phrases = await getStoryData(storyLocale ?? 'cs', String(story?.slug));

  return {
    props: { story, phrases, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoriesContainer;
