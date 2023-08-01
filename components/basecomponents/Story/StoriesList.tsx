import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CountryVariant, getCountryVariant } from 'utils/locales';
import PlayIcon from 'public/icons/stories-play.svg';

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

  const RenderStoryPanel = ({ story }: { story: Story }) => {
    // Check if the current image's source is "/kids/dvanact-mesicku.jpg", because it takes a lot of time to load
    const isPriorityImage = story.slug === 'dvanact-mesicku';

    return (
      <div className="max-w-[342px] sm:max-w-none h-[376px] mb-[32px] sm:w-[400px] sm:h-[400px] sm:mb-[48px] group">
        <div className="rounded-t-2xl relative h-[300px]">
          <Image
            src={`/kids/${story.slug}.jpg`}
            width={400}
            height={300}
            className="w-full h-full object-cover rounded-t-2xl"
            alt={story.title[currentLanguage]}
            priority={isPriorityImage}
          />
          <Link href={`/kids/stories/${story.slug}`} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <PlayIcon className="w-full cursor-pointer w-[60px] h-[60px] sm:w-[74.57px] sm:h-[74.57px] group-hover:visible xl:invisible inline-block active:scale-125 active:fill-primary-yellow active:stroke-primary-yellow transition duration-100 fill-primary-blue stroke-primary-blue" />
          </Link>
        </div>
        <p className="bg-[#FFFFFF] text-primary-blue text-center text-2xl rounded-b-2xl flex justify-center text-center h-[76px] sm:h-[100px] items-center">
          {story.title[currentLanguage]}
        </p>
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
            <h2 className={`text-primary-blue text-center ${currentPlatform === Platform.KIOSK ? 'text-20' : ''}`}>{t(titleKey)}</h2>
            <div className="grid grid-cols-3">
              {localizedStories.map((story) => (
                <StoryCard story={story} key={story.slug} currentLanguage={currentLanguage} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[900px]:grid-cols-2 xl:grid-cols-3 justify-items-center">
            {localizedStories.map((story) => {
              return <RenderStoryPanel key={story.slug} story={story} />;
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
