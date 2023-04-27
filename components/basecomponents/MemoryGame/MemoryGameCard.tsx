import React, { useCallback } from 'react';
import { Card } from './gameStore';
import Image from "next/legacy/image";
import { GameStore, Scene } from './gameStore';

interface MemoryGameCardProps {
  card: Card;
  styles: Record<string, string>;
  cardBackImage: string;
  scene: Scene;
  setCardFrontRef: GameStore['setCardFrontRef'];
  setCardBackRef: GameStore['setCardBackRef'];
  isSelected: GameStore['isSelected'];
  selectCard: (card: Card) => void;
}

const MemoryGameCard = ({
  card,
  cardBackImage,
  styles,
  scene,
  setCardFrontRef,
  setCardBackRef,
  isSelected,
  selectCard,
}: MemoryGameCardProps) => {
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
            <Image src={card.image} layout="fill" sizes="25vw" objectFit="cover" alt={card.text} />
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
