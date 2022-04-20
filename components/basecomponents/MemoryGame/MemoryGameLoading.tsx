import React from 'react';
import styles from './MemoryGame.module.css';
import Image from 'next/image';

const MemoryGameLoading = (): JSX.Element => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <Image src={'/kids/card_back_movapp.png'} layout="fill" sizes="100%" objectFit="cover" alt="loading" priority />
      </div>
    </div>
  );
};

export default MemoryGameLoading;
