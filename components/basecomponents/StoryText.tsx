import React, { MutableRefObject, useEffect, useRef } from 'react';
import { Language } from 'utils/locales';
import { StoryPhrase, STORIES } from './Story/storyStore';

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

const StoryText = ({ textLanguage, audioLanguage, id, audio, onClick }: StoryTextProps): JSX.Element => {
  const phraseRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return scrollToRef(phraseRef, containerRef);
  }, [phraseRef?.current?.offsetTop]);

  const playing = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    const start = `start_${audioLanguage}` as ObjectKey;
    const end = `end_${audioLanguage}` as ObjectKey;
    if (audio !== null) {
      return audio?.currentTime > Number(phrase[start]) && audio?.currentTime < Number(phrase[end]);
    } else {
      return false;
    }
  };

  const played = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    const end = `end_${audioLanguage}` as ObjectKey;
    if (audio !== null) {
      return audio?.currentTime >= Number(phrase[end]);
    } else {
      return false;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const startTime = e.currentTarget.id;

    const phraseInfo: PhraseInfo = { language: textLanguage, time: Number(startTime) };

    onClick(phraseInfo);
  };
  return (
    <div className="mt-4 md:flex bg-slate-100 divide-y-8 divide-white md:divide-y-0 md:w-1/2">
      <div className="max-h-[30vh] md:max-h-full overflow-y-scroll md:overflow-auto" ref={containerRef}>
        {STORIES[id].map((phrase: StoryPhrase, index: number) => (
          <p
            key={index}
            onClick={handleClick}
            ref={playing(phrase) ? phraseRef : null}
            id={textLanguage === 'uk' ? phrase.start_uk.toString() : phrase.start_cs.toString()}
            className={`hover:cursor-pointer mx-6 my-4 text-left ${playing(phrase) && 'text-[#013ABD]'} ${
              played(phrase) && 'text-[#64a5da]'
            }`}
          >
            {textLanguage === 'cs' ? phrase.main : phrase.uk}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StoryText;
