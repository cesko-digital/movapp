import React from 'react';
import styles from './MemoryGameXmasTheme.module.css';
import MemoryGame, { CardData } from '../MemoryGame';

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/xmasbell.mp3',
    winMusic: '/kids/memory-game/jingle_bells.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/xmascard.png',
};

const MemoryGameWithTheme = (props: { cardsData: CardData[] }) => <MemoryGame {...gameData} {...props} />;

export default MemoryGameWithTheme;
