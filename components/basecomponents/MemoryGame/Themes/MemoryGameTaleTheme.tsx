import React from 'react';
import styles from './MemoryGameTaleTheme.module.css';
import MemoryGame, { CardData } from '../MemoryGame';

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/spell.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/talecard.png',
};

const MemoryGameWithTheme = (props: { cardsData: CardData[] }) => <MemoryGame {...gameData} {...props} />;

export default MemoryGameWithTheme;
