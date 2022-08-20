import React from 'react';
import { useLanguage } from 'utils/useLanguageHook';

export const useAudionSource = (id: string) => {
  const { currentLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [seekToPhrase, setSeekToPhrase] = React.useState<number>();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [seekValue, setSeekValue] = React.useState(0);
  const [languagePlay, setLanguagePlay] = React.useState(currentLanguage);

  // using useRef to prevent keeping playing audio when changing route, see: https://stackoverflow.com/questions/37949895/stop-audio-on-route-change-in-react
  const audio = React.useRef<HTMLAudioElement | null>(null);
  const source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;

  React.useEffect(() => {
    audio.current = new Audio(source);
    return () => {
      if (audio.current !== null) {
        audio.current.pause();
      }
    };
  }, [languagePlay, id, source]);

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

  const playPhrase = (start: number) => {
    if (audio.current !== null) {
      setSeekToPhrase(start);
      audio.current.currentTime = start;
      audio.current.play();
      setIsPlaying(true);
    }
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (seekToPhrase) {
      setSeekValue(seekToPhrase);
      if (audio.current !== null) {
        audio.current.currentTime = seekToPhrase;
        audio.current.play();
      }
    }
  }, [seekToPhrase]);

  const time = `${Math.floor(currentTime / 60)}`.padStart(2, '0') + ':' + `${Math.floor(currentTime % 60)}`.padStart(2, '0');

  return {
    languagePlay,
    setLanguagePlay,
    seekValue,
    setSeekValue,
    isPlaying,
    setIsPlaying,
    playStory,
    pauseStory,
    stopStory,
    playPhrase,
    time,
    audio,
  };
};
