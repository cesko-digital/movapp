import React from 'react';
import styles from './MemoryGameTaleTheme.module.css';
import MemoryGame from '../MemoryGameCore';
import getCardsData from '../getCardsData';

// const KIDS_WORDS: Record<CountryVariant, KidsTranlsation[]> = {
//     cs: { /* filter tale words from kids json */ },
//     sk: { /* filter tale words from kids json */ },
//     pl: { /* filter tale words from kids json */ },
//   };

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/spell.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/talecard.png',
  cardsData: getCardsData(),
};

const MemoryGameWithTheme = () => <MemoryGame {...gameData} />;

export default MemoryGameWithTheme;
