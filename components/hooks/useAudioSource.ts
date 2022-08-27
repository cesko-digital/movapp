import React from 'react';
import { useLanguage } from 'utils/useLanguageHook';

export const useAudionSource = (id: string) => {
  const { currentLanguage } = useLanguage();
  const [seekToPhrase, setSeekToPhrase] = React.useState<number>();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [seekValue, setSeekValue] = React.useState(0);
  const [languagePlay, setLanguagePlay] = React.useState(currentLanguage);

  // using useRef to prevent keeping playing audio when changing route, see: https://stackoverflow.com/questions/37949895/stop-audio-on-route-change-in-react
  const audio = React.useRef<HTMLAudioElement | null>(null);
  const source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;

  const isPlaying = () => {
    if (audio.current !== null) {
      return !audio.current?.paused;
    }
    return false;
  };

  const playStory = () => {
    if (audio.current !== null) {
      audio.current.play();
    }
  };

  const pauseStory = () => {
    if (audio.current !== null) {
      audio.current.pause();
    }
  };

  const stopStory = React.useCallback(() => {
    if (audio.current !== null) {
      pauseStory();
      audio.current.currentTime = 0;
    }
  }, []);

  const playPhrase = React.useCallback((start: number) => {
    if (audio.current !== null) {
      const playing = isPlaying();
      if (playing) {
        pauseStory();
      }
      audio.current.currentTime = start;
      playStory();
    }
  }, []);

  React.useEffect(() => {
    audio.current = new Audio(source);
    return () => {
      if (audio.current !== null) {
        stopStory();
      }
    };
  }, [languagePlay, id, source, stopStory]);

  React.useEffect(() => {
    audio.current = new Audio(source);
    return () => {
      audio.current = null;
    };
  }, [source]);

  React.useEffect(() => {
    if (audio.current !== null) {
      audio.current.ontimeupdate = () => {
        if (audio.current !== null) {
          const duration = audio.current.duration;
          const actualTime = audio.current.currentTime;
          setCurrentTime(actualTime);
          setSeekValue(duration ? (actualTime / duration) * 100 : 0);
        }
      };
    }
  });

  React.useEffect(() => {
    if (seekToPhrase) {
      setSeekValue(seekToPhrase);
      if (audio.current !== null) {
        playPhrase(seekToPhrase);
      }
    }
  }, [seekToPhrase, playPhrase]);

  const time = `${Math.floor(currentTime / 60)}`.padStart(2, '0') + ':' + `${Math.floor(currentTime % 60)}`.padStart(2, '0');

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
    setSeekToPhrase,
    time,
    audio,
  };
};
