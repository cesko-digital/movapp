import Link from 'next/link';
import Image from 'next/image';

import { Story } from '@types';

type StoryCardProps = {
  story: Story;
  currentLanguage: string;
};

const StoryCard = ({ story, currentLanguage }: StoryCardProps) => (
  <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl m-5 md:m-8 bg-[#f7e06a]">
    <Link href={`/kiosk/stories/${story.slug}`}>
      <Image
        className={`w-[400px] h-[280px] relative `}
        src={`/kids/${story.slug}.jpg`}
        width={400}
        height={280}
        alt={story.title[currentLanguage]}
      />
      <p className="bg-white text-2xl text-center py-8 text-primary-blue">{story.title[currentLanguage]}</p>
    </Link>
  </div>
);

export default StoryCard;