import React from 'react';
import styles from './MemoryGameLoading.module.css';

const MemoryGameLoading = (): JSX.Element => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}></div>
    </div>
  );
};

export default MemoryGameLoading;
