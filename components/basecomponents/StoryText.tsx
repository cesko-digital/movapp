import React, { useEffect, useRef, MutableRefObject } from 'react';
import oPernikoveChaloupce from '../../data/translations/cs/pohadka_pernikovachaloupka.json';
import oDvanactiMesickach from '../../data/translations/cs/pohadka_mesicky.json';
import oCerveneKarkulce from '../../data/translations/cs/pohadka_karkulka.json';
import oKoblizkovi from '../../data/translations/cs/pohadka_koblizek.json';
import oIvasikovi from '../../data/translations/cs/pohadka_ivasik.json';
import oHusach from '../../data/translations/cs/pohadka_husy.json';

interface StoryTextProps {
  audio: HTMLAudioElement | null;
  languageText: string;
  languagePlay: string;
  id: string;
  onPlaying: (playing: boolean) => void;
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

const StoryText = ({ languageText, languagePlay, audio, id, onPlaying }: StoryTextProps): JSX.Element => {
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

  const playPhrase = (start: number) => {
    if (audio !== null) {
      audio.currentTime = start;
      audio.play();
      onPlaying(true);
    }
  };

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

  return (
    <div className="mt-4 md:flex bg-slate-100 divide-y-8 divide-white md:divide-y-0 md:w-1/2">
      <div className="max-h-[30vh] md:max-h-full overflow-y-scroll md:overflow-auto" ref={containerRef}>
        {selectedStory().map((phrase: StoryPhrase, index: number) => {
          return (
            <div key={index}>
              <button onClick={() => playPhrase(languagePlay === 'cs' ? phrase.start_cs : phrase.start_uk)} className="text-left">
                <p
                  key={index}
                  ref={playing(phrase) ? phraseRef : null}
                  className={`mx-6 my-2 ${playing(phrase) ? 'text-[#013ABD]' : ''} ${played(phrase) ? 'text-[#64a5da]' : ''}`}
                >
                  {languageText === 'cs' ? phrase.main : phrase.uk}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryText;
