import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { PhraseInfo } from 'components/basecomponents/StoryText';
import { useLanguage } from 'utils/useLanguageHook';
import { Language } from 'utils/locales';
import { usePlausible } from 'next-plausible';
import { usePlatform } from 'utils/usePlatform';

// Keep setTimeout value below 951. It is the lowest value, that the browser on Apple devices know and that it can enable autoplay.
const TIMOUT_DELAY = 500;

export const useStoryReader = (id: string) => {
  const { otherLanguage, currentLanguage } = useLanguage();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [languagePlay, setLanguagePlay] = useState<Language>(otherLanguage);

  const shouldSendEventStoryStarted = useRef(true);
  const shouldSendEventStoryFinished = useRef(true);
  const [audioEnded, setAudioEnded] = useState(false);

  const currentPlatform = usePlatform();
  const kiosk = currentPlatform === 'kiosk';

  const audio = useRef<HTMLAudioElement | null>(null);
  const language = currentLanguage;

  const plausible = usePlausible();
  const source = `https://data.movapp.eu/bilingual-reading/${id}-${languagePlay}.mp3`;

  const playStory: VoidFunction = useCallback(() => {
    if (shouldSendEventStoryStarted.current) {
      plausible('Story-Started', {
        props: { story_audio_language: languagePlay, story_name: id, language, kiosk },
      });
      shouldSendEventStoryStarted.current = false;
    }

    if (audio.current !== null) {
      setIsPlaying(true);
      audio.current.play();
    }
  }, [audio, plausible, languagePlay, language, id, kiosk]);

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
      }, TIMOUT_DELAY);

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

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setAudioEnded(true);
    };

    audio.current = new Audio(source);
    audio.current.ontimeupdate = handleTimeUpdate;
    audio.current.onended = handleAudioEnd;
    return () => {
      stopStory();
    };
  }, [source, stopStory]);

  useEffect(() => {
    if (audioEnded && shouldSendEventStoryFinished.current) {
      plausible('Story-Finished', { props: { story_audio_language: languagePlay, story_name: id, language, kiosk } });
      shouldSendEventStoryFinished.current = false;
    }
  }, [audioEnded, language, id, kiosk, languagePlay, plausible]);

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
