import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { CountryVariant, getCountryVariant } from 'utils/locales';

/** Components */
import StoryCard from './StoryCard';

import { useLanguage } from 'utils/useLanguageHook';
import { Platform, Story } from '@types';
import { usePlatform } from 'utils/usePlatform';

type StoriesListProps = {
  stories: Story[];
};
const StoriesList = ({ stories }: StoriesListProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const countryVariant: CountryVariant = getCountryVariant();

  const currentPlatform = usePlatform();

  // We support only stories if there is title translated to current language
  const filteredStories = stories.filter((story) => story.title[countryVariant]);

  // We want to have list of Ukrainian stories, then other stories
  const storiesUA = filteredStories.filter((story) => story.country === 'UA');
  const storiesCEE = filteredStories.filter((story) => story.country === 'CZ');

  const renderStoryPanel = (story: Story) => (
    <div className="h-42 m-auto my-8 flex bg-slate-50 rounded-2xl sm:w-3/5 xl:w-2/5 xxl:w-1/3" key={story.slug}>
      <Image src={`/kids/${story.slug}.jpg`} width="300" className="rounded-l-2xl" height="200" alt={story.title[currentLanguage]} />
      <div className="flex items-center xl:ml-6 w-full">
        <div className="w-3/5">
          <p className="my-4 mx-4 md:mx-8 text-sm lg:text-xl ">{story.title[currentLanguage]}</p>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mx-2 md:ml-8 text-sm lg:text-xl"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm lg:text-xl">{story.duration}</span>
          </div>
        </div>

        <Link
          href={`/kids/stories/${story.slug}`}
          className="w-2/5 bg-primary-blue rounded-2xl text-white text-[10px] sm:text-[12px] lg:text-base p-2 w-3/5 text-center mr-4"
        >
          {t('kids_page.playStory')}
        </Link>
      </div>
    </div>
  );

  const renderStoriesSection = (language: string, stories: Story[], titleKey: string) => {
    // Filter stories that have a title in the current language
    const localizedStories = stories.filter((story: Story) => story.title[language]);

    return (
      <>
        {currentPlatform === Platform.KIOSK ? (
          <div className="flex flex-col">
            <h2 className={`text-primary-blue text-center ${currentPlatform === Platform.KIOSK ? 'text-20' : ''}`}>
              {t(titleKey, { defaultValue: 'stories' })}
            </h2>
            <div className="grid grid-cols-3">
              {localizedStories.map((story) => (
                <StoryCard story={story} key={story.slug} currentLanguage={currentLanguage} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2 className={`text-primary-blue text-center`}>{t(titleKey, { defaultValue: 'stories' })}</h2>
            {localizedStories.map((story) => renderStoryPanel(story))}
          </>
        )}
      </>
    );
  };
  return (
    <div className="flex flex-col">
      {storiesCEE.length > 0 && renderStoriesSection('cs', storiesCEE, 'kids_page.czechStories')}
      {storiesUA.length > 0 && renderStoriesSection('uk', storiesUA, 'kids_page.ukrainianStories')}
    </div>
  );
};

export default StoriesList;
