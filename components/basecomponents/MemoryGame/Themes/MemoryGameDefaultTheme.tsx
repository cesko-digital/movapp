import React from 'react';
import styles from './MemoryGameDefaultTheme.module.css';
import MemoryGame, { CardData } from '../MemoryGame';
import { Phrase } from 'utils/getDataUtils';

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/card_back_movapp.png',
};

const MemoryGameWithTheme = (props: { cardsData: CardData[] }) => <MemoryGame {...gameData} {...props} />;

export default MemoryGameWithTheme;
