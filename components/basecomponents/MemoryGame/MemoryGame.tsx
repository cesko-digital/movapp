import React, { useEffect, useCallback } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { useLanguage } from 'utils/useLanguageHook';
import loaderStyles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';
import { useGameStore } from './gameStore';

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

  if (!initialized) return null;
  const { image, styles } = getTheme();

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
