import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ style }: { style?: React.CSSProperties }): JSX.Element => {
  return <div style={style} className={styles.loading}></div>;
};

export default Spinner;
