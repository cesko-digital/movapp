import React, { useEffect, useState, useRef } from 'react';
import PlayIcon from '../../public/icons/stories-play.svg';
import PauseIcon from '../../public/icons/stories-pause.svg';
import StopIcon from '../../public/icons/stories-stop.svg';
import { Language } from '../../utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { Flag } from './Flag';
import StoryText from './StoryText';

interface StoryReaderProps {
  titleCurrent: string;
  titleOther: string;
  id: string;
  country: string;
}

const StoryReader = ({ titleCurrent, titleOther, id, country }: StoryReaderProps): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [languagePlay, setLanguagePlay] = useState(currentLanguage);

  // using useRef to prevent keeping playing audio when changing route, see: https://stackoverflow.com/questions/37949895/stop-audio-on-route-change-in-react
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;
    audio.current = new Audio(source);
    return () => {
      if (audio.current !== null) {
        audio.current.pause();
      }
    };
  }, [languagePlay, id]);

  const playStory = () => {
    if (audio.current !== null) {
      audio.current.play();
      setIsPlaying(true);
    }
  };

  const pauseStory = () => {
    if (audio.current !== null) {
      audio.current.pause();
      setIsPlaying(false);
    }
  };

  const stopStory = () => {
    if (audio.current !== null) {
      audio.current.pause();
      audio.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audio.current !== null) {
      audio.current.ontimeupdate = () => {
        if (audio.current !== null) {
          const duration = audio.current.duration;
          const actualTime = audio.current.currentTime;
          setCurrentTime(actualTime);
          setSeekValue(duration ? (actualTime / duration) * 100 : 0);
          if (actualTime === duration) {
            setIsPlaying(false);
          }
        }
      };
    }
  });

  const time = `${Math.floor(currentTime / 60)}`.padStart(2, '0') + ':' + `${Math.floor(currentTime % 60)}`.padStart(2, '0');

  const handleLanguageChange = (language: Language) => {
    setSeekValue(0);
    setLanguagePlay(language);
    stopStory();
  };

  return (
    <div className="w-full">
      <div className="controls">
        <div className="flex items-center justify-between">
          <h2 className="p-0 m-0 text-sm sm:text-base md:text-xl">
            {titleCurrent} / {titleOther}
          </h2>
          <div className="flex items-center">
            <button onClick={() => handleLanguageChange('cs')}>
              <Flag
                language="cs"
                width={27}
                height={27}
                className={`mr-3 ml-3 ease-in-out duration-300 ${languagePlay === 'cs' ? 'scale-125' : ''}`}
              />
            </button>
            <button onClick={() => handleLanguageChange('uk')}>
              <Flag
                language="uk"
                width={27}
                height={27}
                className={`ease-in-out duration-300 ${languagePlay === 'uk' ? 'scale-125' : ''}`}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex">
            <button onClick={() => (isPlaying ? pauseStory() : playStory())}>
              {isPlaying ? (
                <PauseIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="50" height="50" />
              ) : (
                <PlayIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="50" height="50" />
              )}
            </button>
            <button onClick={() => stopStory()}>
              {' '}
              <StopIcon className="cursor-pointer active:scale-75 transition-all duration-300" width="50" height="50" />
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full ml-2 mr-2"
            step="1"
            value={seekValue}
            onChange={(e) => {
              const seekto = audio.current !== null ? audio.current.duration * (Number(e.target.value) / 100) : 0;
              audio.current !== null ? (audio.current.currentTime = seekto) : null;
              setSeekValue(Number(e.target.value));
            }}
          />
          <p className="text-xl text-right">{time}</p>
        </div>
      </div>
      <div className="md:flex">
        {country === 'CZ' ? (
          <>
            <StoryText audio={audio.current} languageText="cs" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
            <StoryText audio={audio.current} languageText="uk" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
          </>
        ) : (
          <>
            <StoryText audio={audio.current} languageText="uk" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
            <StoryText audio={audio.current} languageText="cs" languagePlay={languagePlay} onPlaying={setIsPlaying} id={id} />
          </>
        )}
      </div>
    </div>
  );
};

export default StoryReader;
