import React, { useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { TranslationJSON } from 'utils/Phrase_deprecated';
import { getCountryVariant } from 'utils/locales';
import phrases_CS from './memory-game-cs.json';
import phrases_PL from './memory-game-pl.json';
import phrases_SK from './memory-game-sk.json';
import createTimer from './createTimer';
import usePlayPhrase from './usePlayPhrase';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import loaderStyles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';

const playAudio = AudioPlayer.getInstance().playSrc;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (cardsData: CardData[]) =>
  cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));

export const createCardDeck = (cardsData: CardData[]) => {
  // prepare and shuffle cards, pick 8 cards
  const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
  const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

  return [
    ...coloredCards.map((card, index) => ({
      ...card,
      image: card.image,
      id: `card-other-${index}`,
      flipped: false,
      useMainLang: false,
    })),
    ...coloredCards.map((card, index) => ({
      ...card,
      image: card.image,
      id: `card-main-${index}`,
      flipped: false,
      useMainLang: true,
    })),
  ].sort(() => Math.random() - 0.5);
};

const GAME_NARRATION_PHRASES = {
  cs: phrases_CS,
  sk: phrases_SK,
  pl: phrases_PL,
};

const phrases = GAME_NARRATION_PHRASES[getCountryVariant()];

type PlayCardPhrase = (card: Card) => Promise<void>;
type PlayPhraseRandomLang = (phrase: TranslationJSON) => Promise<void>;

export enum Scene {
  init = 'init',
  begin = 'begin',
  game = 'game',
  cardsMatch = 'cardsMatch',
  cardsMatchReward = 'cardsMatchReward',
  cardsDontMatch = 'cardsDontMatch',
  win = 'win',
  winReward = 'winReward',
  goNewGame = 'goNewGame',
}

export type CardData = {
  image: string;
  translation: TranslationJSON;
};

export type Card = CardData & {
  id: string;
  flipped: boolean;
  color: string;
  useMainLang: boolean;
};

export type Theme = {
  id: string;
  image: string;
  audio: {
    cardFlipSound: string;
    cardsMatchSound: string;
    winMusic: string;
  };
  styles: Record<string, string>;
  cardsData: CardData[];
};

export interface SelectedCards {
  first: Card | null;
  second: Card | null;
}

interface MemoryGameProps {
  themes: Theme[];
}

interface GameStore {
  id: number;
  themes: Theme[];
  currentThemeIndex: number;
  getCurrentTheme: () => Theme;
  cards: Card[];
  selectedCards: SelectedCards;
  scene: Scene;
  controlsDisabled: boolean;
  init: (themes: Theme[]) => void;
  restart: (playPhrase: PlayPhraseRandomLang) => () => void;
  changeTheme: (index: number) => void;
  selectCard: (playCardPhrase: PlayCardPhrase, playPhraseRandomLang: PlayPhraseRandomLang) => (card: Card) => void;
  isSelected: (card: Card) => boolean;
}

const useGameStore = create<GameStore>((set, get) => {
  const [setTimer, clearTimers] = createTimer();
  const setScene = (scene: Scene) => set({ scene });
  const disableControls = () => set({ controlsDisabled: true });
  const enableControls = () => set({ controlsDisabled: false });
  const isSelected = (card: Card) => {
    const { first, second } = get().selectedCards;
    return (first !== null && card.id === first.id) || (second !== null && card.id === second.id);
  };
  const flipCard = (cardToFlip: Card) =>
    set((state) => ({ cards: state.cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)) }));

  const increaseId = () => set((state) => ({ id: state.id + 1 }));
  const createIdCheck = (id: number) => () => get().id === id;

  const getCurrentTheme = () => get().themes[get().currentThemeIndex];

  const init = (themes: Theme[]) => {
    clearTimers();
    increaseId();
    disableControls();
    set(() => {
      const currentThemeIndex = 2;
      return { themes, currentThemeIndex };
    });
    begin();
  };

  const begin = () => {
    set((state) => ({
      cards: createCardDeck(state.themes[state.currentThemeIndex].cardsData),
      selectedCards: { first: null, second: null },
      scene: Scene.begin,
    }));
    setTimer(game, 1000);
  };

  const restart = (PlayPhraseRandomLang: PlayPhraseRandomLang) => {
    return () => {
      clearTimers();
      increaseId();
      disableControls();
      setScene(Scene.goNewGame);
      PlayPhraseRandomLang(getRandomElement(phrases.newGame));
      setTimer(begin, 500);
    };
  };

  const changeTheme = (index: number) => {
    clearTimers();
    increaseId();
    disableControls();
    setScene(Scene.goNewGame);
    setTimer(() => {
      set({ currentThemeIndex: index });
      begin();
    }, 500);
  };

  const game = () => {
    setScene(Scene.game);
    enableControls();
  };

  const selectCard = (playCardPhrase: PlayCardPhrase, playPhraseRandomLang: PlayPhraseRandomLang) => async (card: Card) => {
    if (get().controlsDisabled || isSelected(card) || card.flipped) return;
    disableControls();
    const { first, second } = get().selectedCards;
    if (first === null && !card.flipped) {
      selectFirstCard(card, playCardPhrase);
    } else if (first !== null && second === null && !card.flipped) {
      selectSecondCard(card, playCardPhrase, playPhraseRandomLang);
    }
  };

  const selectFirstCard = async (card: Card, playCardPhrase: PlayCardPhrase) => {
    const { audio } = getCurrentTheme();
    set({ selectedCards: { first: card, second: null } });
    flipCard(card); // 0.3s
    await playAudio(audio.cardFlipSound);
    playCardPhrase(card);
    setTimer(() => {
      game();
    }, 600); // reduced for fastrer UI
  };

  const selectSecondCard = async (card: Card, playCardPhrase: PlayCardPhrase, playPhraseRandomLang: PlayPhraseRandomLang) => {
    const { audio } = getCurrentTheme();
    const first = get().selectedCards.first;
    set({ selectedCards: { first, second: card } });
    flipCard(card); // 0.3s
    await playAudio(audio.cardFlipSound);
    await playCardPhrase(card);
    // check if cards match
    if (first !== null && first.image === card.image) {
      cardsMatch(playPhraseRandomLang);
    } else {
      cardsDontMatch(playPhraseRandomLang);
    }
  };

  const cardsMatch = async (playPhraseRandomLang: PlayPhraseRandomLang) => {
    const { audio } = getCurrentTheme();
    setScene(Scene.cardsMatch);
    delay(100);
    await playAudio(audio.cardsMatchSound);
    setScene(Scene.cardsMatchReward);
    Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
    // reset selected cards
    set({ selectedCards: { first: null, second: null } });
    // check win
    if (get().cards.every((card) => card.flipped)) {
      win(playPhraseRandomLang);
    } else {
      game();
    }
  };

  const cardsDontMatch = async (playPhraseRandomLang: PlayPhraseRandomLang) => {
    const { audio } = getCurrentTheme();
    const { first, second } = get().selectedCards;
    const checkId = createIdCheck(get().id);
    setScene(Scene.cardsDontMatch);
    await delay(1000);
    Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));
    // check if still in same game then setState
    if (!checkId()) return;
    if (first === null || second === null) return;
    flipCard(first);
    flipCard(second);
    set({ selectedCards: { first: null, second: null } });
    await playAudio(audio.cardFlipSound);
    if (!checkId()) return;
    game();
  };

  // try catch,

  const win = async (playPhraseRandomLang: PlayPhraseRandomLang) => {
    setScene(Scene.win);
    await playPhraseRandomLang(getRandomElement(phrases.win));
    await delay(200);
    setScene(Scene.winReward);
    playAudio(get().getCurrentTheme().audio.winMusic);
  };

  return {
    id: 0,
    themes: [],
    currentThemeIndex: 0,
    cards: [],
    selectedCards: { first: null, second: null },
    scene: Scene.init,
    init,
    restart,
    getCurrentTheme,
    changeTheme,
    isSelected,
    selectCard,
    controlsDisabled: true,
  };
});

const MemoryGame = ({ themes }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang, playPhraseCurrentLang } = usePlayPhrase();
  const { t } = useTranslation();
  const init = useGameStore((state) => state.init);
  const cards = useGameStore((state) => state.cards);
  const theme = useGameStore((state) => state.getCurrentTheme());
  const changeTheme = useGameStore((state) => state.changeTheme);
  const selectCard = useGameStore((state) => state.selectCard)(playCardPhrase, playPhraseRandomLang);
  const isSelected = useGameStore((state) => state.isSelected);
  const restart = useGameStore((state) => state.restart)(playPhraseCurrentLang);
  const scene = useGameStore((state) => state.scene);

  useEffect(() => {
    init(themes);
  }, [init, themes]);

  if (theme === undefined) return null;
  const { image, styles } = theme;

  return (
    <div className={loaderStyles.app}>
      <div className={loaderStyles.themeNav}>
        {themes.map((theme, index) => (
          <div key={theme.id} className={loaderStyles.themeButton} onClick={() => changeTheme(index)}>
            <Image src={theme.image} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
          </div>
        ))}
      </div>
      <div className={styles.app}>
        <Button className={styles.newGameButton} text={t('utils.new_game')} onClick={restart} />
        <div className={styles.board}>
          {scene !== Scene.init &&
            cards.map((card) => (
              <Card
                key={card.id}
                onClick={selectCard}
                card={card}
                scene={scene}
                styles={styles}
                selected={isSelected(card)}
                cardBackImage={image}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
