import React, { useEffect, useState } from 'react';
import PlayIcon from '../../public/icons/stories-play.svg';
import PauseIcon from '../../public/icons/stories-pause.svg';
import StopIcon from '../../public/icons/stories-stop.svg';
import { Language } from '../../utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { Flag } from './Flag';
import StoryText from './StoryText';

interface StoryReaderProps {
  // language: Language;
  title: string;
  id: string;
  country: string;
}

const StoryReader = ({ title, id, country }: StoryReaderProps): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [languagePlay, setLanguagePlay] = useState(currentLanguage);

  useEffect(() => {
    const source = `https://movapp-data-ifoaaj0j7-ceskodigital.vercel.app/bilingual-reading/${id}-${languagePlay}.mp3`;
    setAudio(new Audio(source));
    return () => {
      setAudio(null); // clean up function
    };
  }, [languagePlay, id]);

  const playStory = () => {
    if (audio !== null) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseStory = () => {
    if (audio !== null) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const stopStory = () => {
    if (audio !== null) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audio !== null) {
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
        setSeekValue((audio.currentTime / audio.duration) * 100);
        if (audio.currentTime === audio.duration) {
          setIsPlaying(false);
        }
      };
    }
  });

  const time = `${Math.floor(currentTime / 60)}`.padStart(2, '0') + ':' + `${Math.floor(currentTime % 60)}`.padStart(2, '0');

  const handleLanguageChange = (language: Language) => {
    setLanguagePlay(language);
    stopStory();
  };

  return (
    <div className="w-full">
      <div className="controls max-h-[20vh]">
        <div className="flex items-center">
          <h2>{title}</h2>
          <button onClick={() => handleLanguageChange('cs')}>
            <Flag
              language="cs"
              width={40}
              height={40}
              className={`mr-3 ml-6 ease-in-out duration-300 ${languagePlay === 'cs' ? 'scale-125' : ''}`}
            />
          </button>
          <button onClick={() => handleLanguageChange('uk')}>
            <Flag
              language="uk"
              width={40}
              height={40}
              className={`mr-3 ease-in-out duration-300 ${languagePlay === 'uk' ? 'scale-125' : ''}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex">
            <button onClick={() => (isPlaying ? pauseStory() : playStory())}>
              {isPlaying ? (
                <PauseIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="60" height="60" />
              ) : (
                <PlayIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="60" height="60" />
              )}
            </button>
            <button onClick={() => stopStory()}>
              {' '}
              <StopIcon className="cursor-pointer active:scale-75 transition-all duration-300" width="60" height="60" />
            </button>
          </div>
          <div className="w-10/12">
            <input
              type="range"
              min="0"
              max="100"
              className="w-11/12 ml-6"
              step="1"
              value={seekValue}
              onChange={(e) => {
                const seekto = audio !== null ? audio.duration * (Number(e.target.value) / 100) : 0;
                audio !== null ? (audio.currentTime = seekto) : null;
                setSeekValue(Number(e.target.value));
              }}
            />
          </div>
        </div>
        <p className="mr-2/10 text-xl text-right">{time}</p>
      </div>
      <div className="md:flex">
        {country === 'CZ' ? (
          <>
            <StoryText audio={audio} languageText="cs" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
            <StoryText audio={audio} languageText="uk" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
          </>
        ) : (
          <>
            <StoryText audio={audio} languageText="uk" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
            <StoryText audio={audio} languageText="cs" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
          </>
        )}
      </div>
    </div>
  );
};

export default StoryReader;
