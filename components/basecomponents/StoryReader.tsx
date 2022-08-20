import React, { useEffect, useState, useRef } from 'react';
import PlayIcon from '../../public/icons/stories-play.svg';
import PauseIcon from '../../public/icons/stories-pause.svg';
import StopIcon from '../../public/icons/stories-stop.svg';
import { getCountryVariant, Language } from '../../utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { Flag } from './Flag';
import StoryText from './StoryText';

interface StoryReaderProps {
  titleCurrent: string;
  titleOther: string;
  id: string;
  country: string;
}

const StoryReader = ({ titleCurrent, titleOther, id }: StoryReaderProps): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeProgress, setTimeProgress] = useState<number>();
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

  const onPlayPhrase = (start: number) => {
    if (audio.current !== null) {
      setTimeProgress(start);
      audio.current.currentTime = start;
      audio.current.play();
      setIsPlaying(true);
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

  useEffect(() => {
    if (timeProgress) {
      setSeekValue(timeProgress);
      if (audio.current !== null) {
        audio.current.currentTime = timeProgress;
        audio.current.play();
      }
    }
  }, [timeProgress]);

  const time = `${Math.floor(currentTime / 60)}`.padStart(2, '0') + ':' + `${Math.floor(currentTime % 60)}`.padStart(2, '0');

  const handleLanguageChange = (language: Language) => {
    setSeekValue(0);
    setLanguagePlay(language);
    stopStory();
  };

  const locales = ['uk' as Language, getCountryVariant()];

  return (
    <div className="w-full">
      <div className="controls">
        <div className="flex items-center justify-between">
          <h2 className="p-0 m-0 text-sm sm:text-base md:text-xl">
            {titleCurrent} / {titleOther}
          </h2>
          <div className={`flex items-center ${currentLanguage !== 'uk' ? 'flex-row-reverse' : 'flex-row'}`}>
            {locales.map((local) => (
              <button
                key={local}
                onClick={() => {
                  handleLanguageChange(local);
                }}
              >
                <Flag
                  language={local}
                  width={27}
                  height={27}
                  className={`ml-3 ease-in-out duration-300 ${local === languagePlay && 'scale-125'}`}
                />
              </button>
            ))}
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
      <div className={`flex ${currentLanguage !== 'uk' ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
        {locales.map((local) => (
          <StoryText
            key={local}
            audio={audio.current}
            languageText={local}
            onClick={(start) => {
              onPlayPhrase(start);
              setLanguagePlay(local);
            }}
            languagePlay={languagePlay}
            id={id}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryReader;
