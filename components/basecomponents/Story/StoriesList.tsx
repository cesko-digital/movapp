import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
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

  const RenderStoryPanel = ({ story, priority }: { story: Story; priority?: boolean }) => {
    return (
      <div className="max-w-[342px] sm:max-w-none h-[376px] mb-[32px] sm:w-[400px] sm:h-[400px] sm:mb-[48px] group">
        <Link href={`/kids/stories/${story.slug}`}>
          <div className="rounded-t-2xl relative h-[300px] overflow-hidden">
            <Image
              src={`/kids/${story.slug}.jpg`}
              width={400}
              height={300}
              className="w-full h-full object-cover rounded-t-2xl group-hover:scale-110 transition duration-200"
              alt={story.title[currentLanguage]}
              priority={priority}
            />
          </div>
          <p className="bg-[#FFFFFF] text-primary-blue text-2xl rounded-b-2xl flex justify-center text-center h-[76px] sm:h-[100px] items-center">
            {story.title[currentLanguage]}
          </p>
        </Link>
      </div>
    );
  };

  const RenderStoriesSection = ({
    language,
    stories,
    titleKey,
  }: {
    language: string;
    stories: Story[];
    titleKey: 'kids_page.czechStories' | 'kids_page.ukrainianStories';
  }) => {
    // Filter stories that have a title in the current language
    const localizedStories = stories.filter((story: Story) => story.title[language]);

    return (
      <>
        {currentPlatform === Platform.KIOSK ? (
          <div className="flex flex-col">
            <h2 className={'text-primary-blue text-center text-20'}>{t(titleKey)}</h2>
            <div className="grid grid-cols-3">
              {localizedStories.map((story) => (
                <StoryCard story={story} key={story.slug} currentLanguage={currentLanguage} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[900px]:grid-cols-2 xl:grid-cols-3 justify-items-center">
            {localizedStories.map((story) => {
              // If the story is the first one, we need to prirotize it, since its image has to be preloaded
              return <RenderStoryPanel key={story.slug} story={story} priority={localizedStories[0] === story} />;
            })}
          </div>
        )}
      </>
    );
  };
  return (
    <div className="flex flex-col max-w-[1296px] m-auto">
      <p className={'text-[30px] sm:text-[38px] text-primary-blue text-center mb-[32px] sm:mb-[43px]'}>{t('header.forkids_stories')}</p>
      {filteredStories.length > 0 && <RenderStoriesSection language="cs" stories={filteredStories} titleKey="kids_page.czechStories" />}
    </div>
  );
};

export default StoriesList;
