import React, { useCallback } from 'react';
import { Card } from './MemoryGame';
import Image from 'next/image';
import usePlayPhrase from './usePlayPhrase';
import { useGameStore } from './MemoryGame';

interface MemoryGameCardProps {
  card: Card;
  // scene: string;
  styles: Record<string, string>;
  cardBackImage: string;
}

const MemoryGameCard = ({ card, cardBackImage, styles }: MemoryGameCardProps) => {
  const { playPhraseRandomLang } = usePlayPhrase(); // calling hooks in every card ... does it hurt performance?
  const setCardFrontRef = useGameStore((state) => state.setCardFrontRef);
  const setCardBackRef = useGameStore((state) => state.setCardBackRef);
  const selectCard = useGameStore((state) => state.selectCard)(playPhraseRandomLang);
  const isSelected = useGameStore((state) => state.isSelected);
  const scene = useGameStore((state) => state.scene);

  console.log('rerender');

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
            <Image src={card.image} layout="fill" sizes="100%" objectFit="cover" alt={card.text} />
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
