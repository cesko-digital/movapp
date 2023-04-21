import { PhraseInfo } from 'components/basecomponents/StoryText';
import React from 'react';
import { useLanguage } from 'utils/useLanguageHook';

export const useStoryReader = (id: string) => {
  const { currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [seekValue, setSeekValue] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [languagePlay, setLanguagePlay] = React.useState(currentLanguage);

  // using useRef to prevent keeping playing audio when changing route, see: https://stackoverflow.com/questions/37949895/stop-audio-on-route-change-in-react
  const audio = React.useRef<HTMLAudioElement | null>(null);
  let source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;
  if (source == 'https://data.movapp.eu/bilingual-reading/dvanact-mesicku-cs.mp3') { // nasty hack for SK fairy tale testing
    source = 'https://data.movapp.eu/bilingual-reading/dvanact-mesicku-sk.mp3'
  }

  const playStory = () => {
    if (audio.current !== null) {
      setIsPlaying(true);
      audio.current.play();
    }
  };

  const pauseStory = () => {
    if (audio.current !== null) {
      setIsPlaying(false);
      audio.current.pause();
    }
  };

  const stopStory = React.useCallback(() => {
    if (audio.current !== null) {
      pauseStory();
      audio.current.currentTime = 0;
    }
  }, []);

  const playPhrase = React.useCallback((value: PhraseInfo) => {
    const { time, language } = value;

    setLanguagePlay(language);
    setSeekValue(time);

    // Keep setTimeout value below 951. It is the lowest value, that the browser on Apple devices know and that it can enable autoplay.
    setTimeout(() => {
      if (audio.current !== null) {
        audio.current.currentTime = time;
        playStory();
      }
    }, 500);
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
    time,
    audio,
  };
};
