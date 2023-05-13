import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

import { PhraseInfo } from 'components/basecomponents/StoryText';
import { useLanguage } from 'utils/useLanguageHook';

import { Language } from 'utils/locales';

export const useStoryReader = (id: string) => {
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [languagePlay, setLanguagePlay] = useState<Language>(currentLanguage);

  const audio = useRef<HTMLAudioElement | null>(null);
  const source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;

  const playStory: VoidFunction = useCallback(() => {
    if (audio.current !== null) {
      setIsPlaying(true);
      audio.current.play();
    }
  }, [audio]);

  const pauseStory: VoidFunction = useCallback(() => {
    if (audio.current !== null) {
      setIsPlaying(false);
      audio.current.pause();
    }
  }, [audio]);

  const stopStory: VoidFunction = useCallback(() => {
    pauseStory();
    if (audio.current !== null) {
      audio.current.currentTime = 0;
    }
  }, [pauseStory]);

  const playPhrase: (value: PhraseInfo) => void = useCallback(
    (value: PhraseInfo) => {
      const { time, language } = value;

      setLanguagePlay(language);
      setSeekValue(time);
      pauseStory(); // pause current audio if it's playing

      const timer = setTimeout(() => {
        if (audio.current !== null) {
          audio.current.currentTime = time;
          playStory();
        }
      }, 500);

      return () => clearTimeout(timer);
    },
    [playStory, pauseStory]
  );

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audio.current === null) {
        return;
      }
      const duration = audio.current.duration;
      const actualTime = audio.current.currentTime;
      setCurrentTime(actualTime);
      setSeekValue(duration ? (actualTime / duration) * 100 : 0);
    };

    const handleAudioEnd = () => setIsPlaying(false);

    audio.current = new Audio(source);
    audio.current.ontimeupdate = handleTimeUpdate;
    audio.current.onended = handleAudioEnd;

    return () => {
      stopStory();
    };
  }, [source, stopStory]);

  const time = useMemo(() => {
    return `${Math.floor(currentTime / 60)
      .toString()
      .padStart(2, '0')}:${Math.floor(currentTime % 60)
      .toString()
      .padStart(2, '0')}`;
  }, [currentTime]);

  return {
    languagePlay,
    setLanguagePlay,
    seekValue,
    setSeekValue,
    isPlaying,
    playStory,
    pauseStory,
    stopStory,
    playPhrase,
    time,
    audio,
  };
};
