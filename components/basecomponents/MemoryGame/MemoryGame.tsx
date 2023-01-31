import React, { useEffect, useCallback } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { useLanguage } from 'utils/useLanguageHook';
import loaderStyles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';
import { useGameStore, Scene } from './gameStore';

const MemoryGame = () => {
  // const narrator = useNarrator(dictionary);
  const { t } = useTranslation();
  const lang = useLanguage();
  // const setNarrator = useGameStore((state) => state.setNarrator);
  const setLang = useGameStore((state) => state.setLang);
  const init = useGameStore((state) => state.init);
  const cards = useGameStore((state) => state.cards);
  const theme = useGameStore((state) => state.getTheme)();
  const themes = useGameStore((state) => state.themes);
  const changeTheme = useGameStore((state) => state.changeTheme);
  const restart = useGameStore((state) => state.restart); // better causes less rerenders
  // const restart = useGameStore((state) => state.restart(playPhraseCurrentLang)); // difference is probably WHEN is function executed
  const scene = useGameStore((state) => state.scene);
  const setButtonRef = useGameStore((state) => state.setButtonRef);
  const setCardFrontRef = useGameStore((state) => state.setCardFrontRef);
  const setCardBackRef = useGameStore((state) => state.setCardBackRef);
  const selectCard = useGameStore((state) => state.selectCard);
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

  // const theme = themes[currentThemeIndex];
  if (theme === undefined) return null;
  const { image, styles } = theme;

  return (
    <div className={loaderStyles.app}>
      <div className={loaderStyles.themeNav}>
        {themes.map((theme, index) => (
          <div key={theme.id} className={loaderStyles.themeButton} onClick={() => changeTheme(index)}>
            <Image src={theme.image} layout="fill" sizes="25vw" objectFit="cover" alt="card back" priority />
          </div>
        ))}
      </div>
      <div className={styles.app}>
        <Button ref={buttonRef} className={styles.newGameButton} text={t('utils.new_game')} onClick={restart} />
        <div className={styles.board}>
          {scene !== Scene.init &&
            cards.map((card) => (
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
