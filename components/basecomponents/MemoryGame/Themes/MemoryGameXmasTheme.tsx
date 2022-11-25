import React from 'react';
import styles from './MemoryGameXmasTheme.module.css';
import MemoryGame from '../MemoryGame';
import getCardsData from '../getCardsData';

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/xmasbell.mp3',
    winMusic: '/kids/memory-game/jingle_bells.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/xmascard.png',
  cardsData: getCardsData(), // TODO: filter cards for current theme
};

const MemoryGameWithTheme = () => <MemoryGame {...gameData} />;

export default MemoryGameWithTheme;
