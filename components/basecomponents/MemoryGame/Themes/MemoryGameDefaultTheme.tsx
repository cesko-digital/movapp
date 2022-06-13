import React from 'react';
import styles from './MemoryGameDefaultTheme.module.css';
import MemoryGame from '../MemoryGameCore';
import kidsWords_CS from 'data/translations/cs/pro-deti.json';
import kidsWords_SK from 'data/translations/sk/pro-deti_sk.json';
import kidsWords_PL from 'data/translations/pl/pro-deti_pl.json';
import normalizeCardsData from '../normalizeCardsData';

const KIDS_WORDS = {
  cs: kidsWords_CS,
  sk: kidsWords_SK,
  pl: kidsWords_PL,
};

const gameData = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles,
  cardBackImage: '/kids/memory-game/card_back_movapp.png',
  cardsData: normalizeCardsData(KIDS_WORDS),
};

const MemoryGameWithTheme = () => <MemoryGame {...gameData} />;

export default MemoryGameWithTheme;
