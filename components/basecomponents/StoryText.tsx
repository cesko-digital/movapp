import React, { MutableRefObject, useEffect, useRef } from 'react';
import oPernikoveChaloupce from '../../data/translations/cs/pohadka_pernikovachaloupka.json';
import oDvanactiMesickach from '../../data/translations/cs/pohadka_mesicky.json';
import oCerveneKarkulce from '../../data/translations/cs/pohadka_karkulka.json';
import oKoblizkovi from '../../data/translations/cs/pohadka_koblizek.json';
import oIvasikovi from '../../data/translations/cs/pohadka_ivasik.json';
import oHusach from '../../data/translations/cs/pohadka_husy.json';

export type PhraseInfo = { language: string; time: number };

interface StoryTextProps {
  audio: HTMLAudioElement | null;
  languageText: string;
  languagePlay: string;
  id: string;
  onClick: ({ language, time }: PhraseInfo) => void;
}

interface StoryPhrase {
  main: string;
  uk: string;
  start_cs: number;
  end_cs: number;
  start_uk: number;
  end_uk: number;
}

const scrollToRef = (ref: MutableRefObject<HTMLParagraphElement | null>, div: MutableRefObject<HTMLDivElement | null>) => {
  if (ref.current !== null && div.current !== null) {
    div.current.scrollTo(0, ref.current.offsetTop - div.current.offsetTop - 100);
  }
};

const StoryText = ({ languageText, languagePlay, id, audio, onClick }: StoryTextProps): JSX.Element => {
  const phraseRef = useRef<HTMLParagraphElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedStory = () => {
    const stories: Record<string, StoryPhrase[]> = {
      'pernikova-chaloupka': oPernikoveChaloupce,
      'dvanact-mesicku': oDvanactiMesickach,
      'cervena-karkulka': oCerveneKarkulce,
      kolobok: oKoblizkovi,
      'husy-lebedi': oHusach,
      'ivasik-telesik': oIvasikovi,
    };
    return stories[id];
  };

  useEffect(() => {
    return scrollToRef(phraseRef, containerRef);
  }, [phraseRef?.current?.offsetTop]);

  const playing = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    const start = `start_${languagePlay}` as ObjectKey;
    const end = `end_${languagePlay}` as ObjectKey;
    if (audio !== null) {
      return audio?.currentTime > phrase[start] && audio?.currentTime < phrase[end];
    } else {
      return false;
    }
  };

  const played = (phrase: StoryPhrase) => {
    type ObjectKey = keyof typeof phrase;
    const end = `end_${languagePlay}` as ObjectKey;
    if (audio !== null) {
      return audio?.currentTime >= phrase[end];
    } else {
      return false;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    const phraseId = e.currentTarget.id.replace(languageText, '').replace('-', '');

    const phraseInfo: PhraseInfo = { language: languageText, time: Number(phraseId) };

    onClick(phraseInfo);
  };

  return (
    <div className="mt-4 md:flex bg-slate-100 divide-y-8 divide-white md:divide-y-0 md:w-1/2">
      <div className="max-h-[30vh] md:max-h-full overflow-y-scroll md:overflow-auto" ref={containerRef}>
        {selectedStory().map((phrase: StoryPhrase, index: number) => (
          <p
            key={index}
            onClick={handleClick}
            ref={playing(phrase) ? phraseRef : null}
            id={languageText === 'uk' ? `${'uk-' + phrase.start_uk}` : `${'cs-' + phrase.start_cs}`}
            className={`hover:cursor-pointer mx-6 my-4 text-left ${playing(phrase) && 'text-[#013ABD]'} ${
              played(phrase) && 'text-[#64a5da]'
            }`}
          >
            {languageText === 'cs' ? phrase.main : phrase.uk}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StoryText;
