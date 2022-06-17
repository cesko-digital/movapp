import React from 'react';
import styles from './MemoryGameDefaultTheme.module.css';
import MemoryGame from '../MemoryGameCore';
import getCardsData from '../getCardsData';

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/card_back_movapp.png',
  cardsData: getCardsData(),
};

const MemoryGameWithTheme = () => <MemoryGame {...gameData} />;

export default MemoryGameWithTheme;
