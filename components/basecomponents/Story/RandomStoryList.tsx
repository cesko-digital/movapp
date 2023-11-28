'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import stories from '../../../data/stories';
import { useLanguage } from 'utils/useLanguageHook';
import { useRouter } from 'next/router';

type RandomStoryListProps = {
  currentStorySlug: string;
};

const RandomStoryList: React.FC<RandomStoryListProps> = ({ currentStorySlug }) => {
  const { currentLanguage } = useLanguage();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [randomStoriesArray, setRandomStoriesArray] = useState<any[]>([]);
  const language = currentLanguage;

  useEffect(() => {
    const filteredStories = stories.filter((story) => {
      const isUkrainian = language === 'uk';
      const hasTranslationSlovakian = story.title['uk'] && story.title['sk'];
      const hasTranslationCzech = story.title['uk'] && story.title['cs'];
      if (currentLanguage === 'sk') {
        return (isUkrainian ? hasTranslationSlovakian : story.title[currentLanguage]) && story.slug !== currentStorySlug;
      }
      return (isUkrainian ? hasTranslationCzech : story.title[currentLanguage]) && story.slug !== currentStorySlug;
    });

    const getRandomStories = () => {
      const maxAttempts = 3;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const randomStoriesArray: any[] = [];
      const storiesCount = filteredStories.length;

      for (let i = 0; i < maxAttempts && randomStoriesArray.length < 3; i++) {
        const randomIndex = Math.floor(Math.random() * storiesCount);
        const randomStory = filteredStories[randomIndex];
        if (!randomStoriesArray.includes(randomStory)) {
          randomStoriesArray.push(randomStory);
        }
      }

      setRandomStoriesArray(randomStoriesArray);
    };

    getRandomStories();
  }, [currentLanguage, router.query.slug, currentStorySlug, language]);

  return (
    <div className="w-full mx-auto py-10">
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
        {randomStoriesArray.map((story) => {
          return (
            <li key={story.slug} className="bg-white shadow-m rounded-[32px] text-center">
              <Link href={`/kids/stories/${story.slug}`}>
                <Image
                  className="rounded-t-[32px] w-full"
                  src={`/kids/${story.slug}.jpg`}
                  alt={story.title[currentLanguage]}
                  width={354}
                  height={266}
                />
                <p className="bg-white h-[88px] font-bold text-xl text-center px-4 pt-4 pb-6 text-primary-blue rounded-b-[32px] flex items-center justify-center">
                  {story.title[currentLanguage]}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RandomStoryList;
