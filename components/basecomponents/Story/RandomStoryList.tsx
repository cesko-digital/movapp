import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import stories from '../../../data/stories';
import { useLanguage } from 'utils/useLanguageHook';

const maxAttempts = 2;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const randomStories: any[] = [];
const storiesCount = stories.length;

for (let i = 0; i < maxAttempts && randomStories.length < 3; i++) {
  const randomIndex = Math.floor(Math.random() * storiesCount);
  const randomStory = stories[randomIndex];
  if (!randomStories.includes(randomStory)) {
    randomStories.push(randomStory);
  }
}

const RandomStoryList: React.FC = () => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="mt-8 h-[354px]">
      <ul className="block xl:flex w-full xl:gap-6 justify-center">
        {randomStories.map((story) => {
          return (
            <li key={story.slug} className="mb-8 bg-white shadow-m w-[354px] h-[354px] rounded-[32px]">
              <div>
                <Link href={`/kids/stories/${story.slug}`}>
                  <Image
                    className={`w-[354px] h-[266px] overflow-hidden rounded-t-[32px]`}
                    src={`/kids/${story.slug}.jpg`}
                    width={354}
                    height={266}
                    alt={story.title[currentLanguage]}
                  />
                  <p className="bg-white h-[88px] font-bold text-xl text-center px-4 pt-4 pb-6 text-primary-blue rounded-b-[32px] flex items-center justify-center">
                    {story.title[currentLanguage]}
                  </p>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RandomStoryList;
