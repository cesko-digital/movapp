import React, { useCallback } from 'react';
import { Card } from './MemoryGame';
import Image from 'next/image';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase_deprecated } from 'utils/Phrase_deprecated';
import usePlayPhrase from './usePlayPhrase';
import { useGameStore } from './MemoryGame';

interface MemoryGameCardProps {
  card: Card;
  scene: string;
  styles: Record<string, string>;
  cardBackImage: string;
}

const MemoryGameCard = ({ card, cardBackImage, scene, styles }: MemoryGameCardProps) => {
  const { currentLanguage } = useLanguage();
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const setCardFrontRef = useGameStore((state) => state.setCardFrontRef);
  const setCardBackRef = useGameStore((state) => state.setCardBackRef);
  const selectCard = useGameStore((state) => state.selectCard)(playCardPhrase, playPhraseRandomLang);
  const isSelected = useGameStore((state) => state.isSelected);

  console.log('rerednder');

  const frontRef = useCallback(
    (node) => {
      if (node === null) return;
      setCardFrontRef(card.id, node);
    },
    [card.id, setCardFrontRef]
  );

  const backRef = useCallback(
    (node) => {
      if (node === null) return;
      setCardBackRef(card.id, node);
    },
    [card.id, setCardBackRef]
  );

  const selected = isSelected(card.id);

  return (
    <>
      <div
        onClick={() => selectCard(card)}
        className={`${styles.cell} ${card.flipped ? styles.flipped : ''} ${selected ? styles.selected : ''}`}
      >
        <div className={styles.cardWrapper}>
          <div
            ref={frontRef}
            className={`${styles.front} ${card.flipped ? styles.flipped : ''} ${selected ? styles.selected : ''} ${
              styles[scene] ? styles[scene] : ''
            } `}
            style={{ borderColor: card.color }}
          >
            <Image
              src={card.image}
              layout="fill"
              sizes="100%"
              objectFit="cover"
              alt={new Phrase_deprecated(card.translation).getTranslation(currentLanguage)}
            />
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div ref={backRef} className={`${styles.back} ${card.flipped ? styles.flipped : ''} ${styles[scene] ? styles[scene] : ''}`}>
            <Image src={cardBackImage} layout="fill" sizes="25vw" objectFit="cover" alt="card back" priority />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryGameCard;
