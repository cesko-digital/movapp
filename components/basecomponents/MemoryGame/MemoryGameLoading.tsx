import React from 'react';
import styles from './MemoryGameLoading.module.css';
import Spinner from '../Spinner/Spinner';

const MemoryGameLoading = (): JSX.Element => {
  return (
    <div className={styles.loadingContainer}>
      <Spinner />
    </div>
  );
};

export default MemoryGameLoading;
