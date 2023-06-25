import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { Story } from '@types';

type StoryPanelProps = {
  story: Story;
  currentLanguage: string;
};
const StoryPanel = ({ story, currentLanguage }: StoryPanelProps) => {
  const { t } = useTranslation();

  return (
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
};

export default StoryPanel;
