import { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { usePlausible } from 'next-plausible';
import { usePlatform } from 'utils/usePlatform';
import { Platform } from '@types';
import { useGameStore, Scene } from './gameStore';

/* eslint-disable no-console */

export const useTracking = () => {
  const scene = useGameStore((state) => state.scene);
  const currentThemeIndex = useGameStore((state) => state.currentThemeIndex);
  const selectedCards = useGameStore((state) => state.selectedCards);

  const plausible = usePlausible();
  const platform = usePlatform();
  const isKiosk = platform === Platform.KIOSK;
  const { currentLanguage } = useLanguage();

  const enabledAnalytics = useRef(true);

  useEffect(() => {
    const selected = enabledAnalytics.current && !!selectedCards.first;
    if (selected) {
      console.log('Pexeso is started, sending to Plausible');
      plausible('Pexeso-Started', { props: { language: currentLanguage, theme: currentThemeIndex, kiosk: isKiosk } });
      enabledAnalytics.current = false;
    }
  }, [currentLanguage, currentThemeIndex, isKiosk, plausible, selectedCards.first]);

  useEffect(() => {
    if (scene === Scene.win) {
      console.log('Pexeso is finished, sending to Plausible');
      plausible('Pexeso-Finished', { props: { language: currentLanguage, theme: currentThemeIndex, kiosk: isKiosk } });
    }
  }, [currentThemeIndex, isKiosk, currentLanguage, plausible, scene]);

  useEffect(() => {
    if (scene === Scene.begin) {
      enabledAnalytics.current = true;
    }
  }, [scene]);
};
