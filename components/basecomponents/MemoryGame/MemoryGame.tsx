import React, { useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { useLanguage } from 'utils/useLanguageHook';
import loaderStyles from './MemoryGameThemeLoader.module.css';
import Image from 'next/legacy/image';
import { useGameStore, Scene } from './gameStore';
import { usePlausible } from 'next-plausible';
import { usePlatform } from 'utils/usePlatform';
import { Platform } from '@types';
import { Card as CardT } from './gameStore';

const MemoryGame = () => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const setLang = useGameStore((state) => state.setLang);
  const init = useGameStore((state) => state.init);
  const initialized = useGameStore((state) => state.initialized);
  const cards = useGameStore((state) => state.cards);
  const getTheme = useGameStore((state) => state.getTheme);
  const themes = useGameStore((state) => state.themes);
  const changeTheme = useGameStore((state) => state.changeTheme);
  const restart = useGameStore((state) => state.restart);
  const scene = useGameStore((state) => state.scene);
  const setButtonRef = useGameStore((state) => state.setButtonRef);
  const setCardFrontRef = useGameStore((state) => state.setCardFrontRef);
  const setCardBackRef = useGameStore((state) => state.setCardBackRef);
  const selectCardFunc = useGameStore((state) => state.selectCard);
  const currentThemeIndex = useGameStore((state) => state.currentThemeIndex);
  const plausible = usePlausible();
  const platform = usePlatform();
  const isKiosk = platform === Platform.KIOSK;
  const enabledAnalytics = useRef(true);
  const selectCard = useCallback(
    (card: CardT) => {
      if (enabledAnalytics.current) {
        console.log('Pexeso is started, sending to Plausible');
        plausible('Pexeso-Started', { props: { language: lang.currentLanguage, theme: currentThemeIndex, kiosk: isKiosk } });
        enabledAnalytics.current = false;
      }
      selectCardFunc(card);
    },
    [currentThemeIndex, isKiosk, lang.currentLanguage, plausible, selectCardFunc]
  );
  useEffect(() => {
    if (scene === Scene.win) {
      console.log('Pexeso is finished, sending to Plausible');
      plausible('Pexeso-Finished', { props: { language: lang.currentLanguage, theme: currentThemeIndex, kiosk: isKiosk } });     
    }
  }, [currentThemeIndex, isKiosk, lang.currentLanguage, plausible, scene]);
  const isSelected = useGameStore((state) => state.isSelected);

  const buttonRef = useCallback(
    (buttonNode) => {
      if (buttonNode === null) return;
      setButtonRef(buttonNode);
    },
    [setButtonRef]
  );

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return null;
  const { image, styles } = getTheme();

  return (
    <div className={loaderStyles.app}>
      <div className={loaderStyles.themeNav}>
        {themes.map((theme, index) => (
          <div
            key={theme.id}
            className={loaderStyles.themeButton}
            onClick={() => {
              changeTheme(index);
              enabledAnalytics.current = true;
            }}
          >
            <Image src={theme.image} layout="fill" sizes="25vw" objectFit="cover" alt="card back" priority />
          </div>
        ))}
      </div>
      <div className={styles.app}>
        <button
          ref={buttonRef}
          className={styles.newGameButton}
          onClick={() => {
            restart();
            enabledAnalytics.current = true;
          }}
        >
          {t('utils.new_game')}
        </button>
        <div className={styles.board}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              scene={scene}
              styles={styles}
              cardBackImage={image}
              setCardFrontRef={setCardFrontRef}
              setCardBackRef={setCardBackRef}
              isSelected={isSelected}
              selectCard={selectCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
