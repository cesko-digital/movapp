import React from 'react';
import { Card } from './MemoryGameCore';
import Image from 'next/image';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from 'utils/Phrase';

interface MemoryGameCardProps {
  card: Card;
  scene: string;
  selected: boolean;
  styles: Record<string, string>;
  cardBackImage: string;
  onClick: (card: Card) => void;
}

const MemoryGameCard = ({ card, cardBackImage, onClick, scene, selected, styles }: MemoryGameCardProps): JSX.Element => {
  const { currentLanguage } = useLanguage();

  return (
    <>
      <div onClick={() => onClick(card)} className={`${styles.cell} ${styles.cell}`}>
        <div className={styles.cardWrapper}>
          <div
            className={`${styles.front} ${card.flipped ? styles.flipped : ''} ${selected ? styles.selected : ''} ${styles[scene]} `}
            style={{ borderColor: card.color }}
          >
            <Image
              src={card.image}
              layout="fill"
              sizes="100%"
              objectFit="cover"
              alt={new Phrase(card.translation).getTranslation(currentLanguage)}
            />
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={`${styles.back} ${card.flipped ? styles.flipped : ''} ${styles[scene]}`}>
            <Image src={cardBackImage} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryGameCard;
