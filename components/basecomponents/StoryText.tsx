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

const getPosition = (phrase: StoryPhrase, audioLanguage: Language): { end: number; start: number } => {
  type ObjectKey = keyof typeof phrase;
  const audioLanguageKey = audioLanguage === 'uk' ? 'uk' : 'cs';
  const start = `start_${audioLanguageKey}` as ObjectKey;
  const end = `end_${audioLanguageKey}` as ObjectKey;

  return { start: Number(phrase[start]), end: Number(phrase[end]) };
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
    const { start, end } = getPosition(phrase, audioLanguage);
    return audio !== null ? audio?.currentTime > start && audio?.currentTime < end : false;
  };

  const played = (phrase: StoryPhrase) => {
    const { end } = getPosition(phrase, audioLanguage);
    return audio !== null ? audio?.currentTime >= end : false;
  };

  const handleClick = (startTime: string) => {
    const phraseInfo: PhraseInfo = { language: textLanguage, time: Number(startTime) };

    return () => {
      onClick(phraseInfo);
    };
  };

  if (storyData.length === 0) return <div>Loading...</div>;

  return (
    <div className="mt-4 md:flex bg-slate-100 divide-y-8 divide-white md:divide-y-0 md:w-1/2">
      <div className="max-h-[30vh] md:max-h-full overflow-y-scroll md:overflow-auto" ref={containerRef}>
        {storyData.map((phrase: StoryPhrase) => (
          <div key={phrase.start_cs} className="flex w-full">
            <p
              key={phrase.start_cs}
              onClick={handleClick(textLanguage === 'uk' ? phrase.start_uk.toString() : phrase.start_cs.toString())}
              ref={playing(phrase) ? phraseRef : null}
              id={textLanguage === 'uk' ? phrase.start_uk.toString() : phrase.start_cs.toString()}
              className={`storyText ${playing(phrase) && 'storyText-playing'} ${played(phrase) && 'storyText-played'}`}
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
