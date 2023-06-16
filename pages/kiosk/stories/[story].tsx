import React, { ReactNode } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import StoryReader from '../../../components/basecomponents/StoryReader';
import stories from '../../../data/stories';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Story } from '@types';
import { getCountryVariant, Language } from '../../../utils/locales';
import Custom404 from '../../404';
import { StoryPhrase, getStoryData } from '../../../components/basecomponents/Story/storyStore';
import { useSetAtom } from 'jotai';
import { currentPlatformAtom } from 'components/basecomponents/Kiosk/atoms';
import { Platform } from '@types';

import withKioskLayout from 'utils/hoc/withKioskLayout';
interface StoriesProps {
  story: Story | undefined;
  phrases: StoryPhrase[];
}

interface UrlParams extends ParsedUrlQuery {
  story: string;
}

const StoriesContainer = ({ story, phrases }: StoriesProps): ReactNode => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const setCurrentPlatform = useSetAtom(currentPlatformAtom);

  if (!story) {
    return 'Story not found';
  }

  if (!story.title[currentLanguage] || !story.title[otherLanguage]) {
    return null;
  }

  const title_current = story.title[currentLanguage] || '';
  const title_other = story.title[otherLanguage] || '';
  setCurrentPlatform(Platform.KIOSK);

  return (
    <>
      {['cs', 'sk'].includes(getCountryVariant()) ? (
        <div className="px-6 py-4 flex rounded-2xl overflow-hidden shadow-xl bg-white md:w-4/5 m-auto">
          <StoryReader titleCurrent={title_current} titleOther={title_other} id={story.slug} country={story.country} phrases={phrases} />
        </div>
      ) : (
        <Custom404 />
      )}
    </>
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

  const phrases = await getStoryData((locale as Language) ?? 'cs', String(story?.slug));

  return {
    props: { story, phrases, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default withKioskLayout(StoriesContainer);
