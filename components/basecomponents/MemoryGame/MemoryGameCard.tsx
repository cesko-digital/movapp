import React from 'react';
import { CardType } from './MemoryGame';
import styles from './MemoryGameCard.module.css';
import Image from 'next/image';
import { useLanguage } from 'utils/useLanguageHook';

interface MemoryGameCardProps {
  card: CardType;
  scene: string;
  selected: boolean;  
  onClick: (card: CardType) => void;
}

const MemoryGameCard = ({ card, onClick, scene, selected }: MemoryGameCardProps): JSX.Element => {
  const { currentLanguage } = useLanguage();

  return (
    <>
      <div onClick={() => onClick(card)} className={styles.cell}>
        <div className={styles.cardWrapper}>
          <div className={`${styles.front} ${card.flipped ? styles.flipped : ''} ${selected ? styles.selected : ''} ${styles[scene]} `} style={{ borderColor: card.color }}>
            <Image src={card.image} layout="fill" sizes="100%" objectFit="cover" alt={card.translation[currentLanguage]} />
          </div>
        </div>
        <div className={styles.cardWrapper}>
          <div className={`${styles.back} ${card.flipped ? styles.flipped : ''} ${styles[scene]}`}>
            <Image src={'/kids/card_back_movapp.png'} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryGameCard;
