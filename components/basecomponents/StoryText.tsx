import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Language, getCountryVariant } from 'utils/locales';
import { StoryPhrase, getStoryData } from './Story/storyStore';

export type PhraseInfo = { language: Language; time: number };

interface StoryTextProps {
  audio: HTMLAudioElement | null;
  textLanguage: Language;
  audioLanguage: Language;
  id: string;
  onClick: ({ language, time }: PhraseInfo) => void;
}

const scrollToRef = (ref: MutableRefObject<HTMLParagraphElement | null>, div: MutableRefObject<HTMLDivElement | null>) => {
  if (ref.current !== null && div.current !== null) {
    div.current.scrollTo(0, ref.current.offsetTop - div.current.offsetTop - 100);
  }
};

const StoryText = ({ textLanguage, audioLanguage, audio, onClick }: StoryTextProps): JSX.Element => {
  const phraseRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainLanguage = getCountryVariant();
  const {
    query: { story },
  } = useRouter();

  const [storyData, setStoryData] = useState<StoryPhrase[]>([]);

  useEffect(() => {
    if (!story) return;
    getStoryData(mainLanguage, String(story))
      .then((data) => setStoryData(data))
      .catch((err) => console.error(err));
  }, [mainLanguage, story]);

  useEffect(() => {
    return scrollToRef(phraseRef, containerRef);
  }, [phraseRef?.current?.offsetTop]);

  const playing = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    audioLanguage = audioLanguage === 'uk' ? 'uk' : 'cs';
    const start = `start_${audioLanguage}` as ObjectKey;
    const end = `end_${audioLanguage}` as ObjectKey;
    if (audio !== null) {
      return audio?.currentTime > phrase[start] && audio?.currentTime < phrase[end];
    } else {
      return false;
    }
  };

  const played = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    const end = `end_${audioLanguage}` as ObjectKey;
    return audio !== null ? audio?.currentTime >= phrase[end] : false;
  };

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const startTime = e.currentTarget.id;

    const phraseInfo: PhraseInfo = { language: textLanguage, time: Number(startTime) };

    onClick(phraseInfo);
  };

  if (storyData.length === 0) return <div>Loading...</div>;

  return (
    <div className="mt-4 md:flex bg-slate-100 divide-y-8 divide-white md:divide-y-0 md:w-1/2">
      <div className="max-h-[30vh] md:max-h-full overflow-y-scroll md:overflow-auto" ref={containerRef}>
        {storyData.map((phrase: StoryPhrase, index: number) => (
          <div key={phrase.start_cs} className="flex w-full">
            <p
              key={index}
              onClick={handleClick}
              ref={playing(phrase) ? phraseRef : null}
              id={textLanguage === 'uk' ? phrase.start_uk.toString() : phrase.start_cs.toString()}
              className={`hover:cursor-pointer mx-6 my-4 text-left ${playing(phrase) && 'text-[#013ABD]'} ${
                played(phrase) && 'text-[#64a5da]'
              }`}
            >
              {textLanguage === 'uk' ? phrase.uk : phrase.main}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryText;
