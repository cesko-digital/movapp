import React, { useEffect, useCallback } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { TranslationJSON } from 'utils/Phrase_deprecated';
import { getCountryVariant } from 'utils/locales';
import { Phrase } from 'utils/getDataUtils';
import createTimer from './createTimer';
import usePlayPhrase from './usePlayPhrase';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import loaderStyles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';
import anime from 'animejs';

const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (phrases: Phrase[]) =>
  phrases.map((item, i) => ({ ...item, color: `hsl(${(360 / phrases.length) * i},50%,50%)` }));

export const createCardDeck = (phrases: Phrase[], gameId: number) => {
  // prepare and shuffle cards, pick 8 cards
  const pickedCards = phrases.sort(() => Math.random() - 0.5).slice(0, 8);
  const coloredCards = addBackroundColor(pickedCards) as (Phrase & { color: string })[];

  return [
    ...coloredCards.map((phrase) => ({
      ...phrase,
      image: phrase.getImageUrl() ?? '',
      sound: phrase.getSoundUrl('uk'),
      text: phrase.getTranslation('uk'),
      id: `${gameId}-card-uk-${phrase.getImageUrl()}`,
      flipped: false,
      frontRef: null,
      backRef: null,
    })),
    ...coloredCards.map((phrase) => ({
      ...phrase,
      image: phrase.getImageUrl() ?? '',
      sound: phrase.getSoundUrl(),
      text: phrase.getTranslation(),
      id: `${gameId}-card-main-${phrase.getImageUrl()}`,
      flipped: false,
      frontRef: null,
      backRef: null,
    })),
  ].sort(() => Math.random() - 0.5);
};

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
  sound: string;
  translation: TranslationJSON;
};

export type Card = {
  id: string;
  flipped: boolean;
  color: string;
  sound: string;
  image: string;
  text: string;
  frontRef: React.LegacyRef<HTMLDivElement> | null;
  backRef: React.LegacyRef<HTMLDivElement> | null;
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
  phrases: Phrase[];
};

export interface SelectedCards {
  first: Card | null;
  second: Card | null;
}

interface MemoryGameProps {
  themes: Theme[];
  narratorPhrases: Record<string, Phrase[]>;
}

interface GameStore {
  id: number;
  themes: Theme[];
  currentThemeIndex: number;
  cards: Card[];
  selectedCards: SelectedCards;
  scene: Scene;
  controlsDisabled: boolean;
  init: (themes: Theme[]) => void;
  restart: (playPhrase: PlayPhraseRandomLang) => () => void;
  changeTheme: (index: number) => void;
  getCurrentTheme: () => Theme;
  selectCard: (playPhraseRandomLang: PlayPhraseRandomLang) => (card: Card) => void;
  isSelected: (cardId: Card['id']) => boolean;
  setCardFrontRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setCardBackRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setButtonRef: (ref: React.Ref<HTMLButtonElement>) => void;
  buttonRef: React.Ref<HTMLButtonElement> | null;
}

export const useGameStore = create<GameStore>((set, get) => {
  const [setTimer, clearTimers] = createTimer();
  const setScene = (scene: Scene) => set({ scene });
  const disableControls = () => set({ controlsDisabled: true });
  const enableControls = () => set({ controlsDisabled: false });
  const isSelected = (cardId: Card['id']) => {
    const { first, second } = get().selectedCards;
    return (first !== null && cardId === first.id) || (second !== null && cardId === second.id);
  };
  const flipCard = (cardId: Card['id']) =>
    set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, flipped: !card.flipped } : card)) }));

  const increaseId = () => set((state) => ({ id: state.id + 1 }));
  const createIdCheck = (id: number) => () => get().id === id;

  const getCurrentTheme = () => get().themes[get().currentThemeIndex];

  const init = (themes: Theme[]) => {
    clearTimers();
    increaseId();
    disableControls();
    set({ themes, currentThemeIndex: 2 });
    begin();
  };

  const begin = () => {
    set((state) => ({
      cards: createCardDeck(state.themes[state.currentThemeIndex].phrases, get().id),
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

  const selectCard = (playPhraseRandomLang: PlayPhraseRandomLang) => async (card: Card) => {
    if (get().controlsDisabled || isSelected(card.id) || card.flipped) return;
    disableControls();
    anime({ targets: card.backRef, opacity: 0.5 });
    const { first, second } = get().selectedCards;
    if (first === null && !card.flipped) {
      selectFirstCard(card);
    } else if (first !== null && second === null && !card.flipped) {
      selectSecondCard(card, playPhraseRandomLang);
    }
  };

  const selectFirstCard = async (card: Card) => {
    const { audio } = getCurrentTheme();
    set({ selectedCards: { first: card, second: null } });
    flipCard(card.id); // 0.3s
    anime({ targets: get().buttonRef, opacity: 0.1, duration: 1500 });
    await playAudio(audio.cardFlipSound);
    playAudio(card.sound);
    setTimer(() => {
      game();
    }, 600); // reduced for fastrer UI
  };

  const selectSecondCard = async (card: Card, playPhraseRandomLang: PlayPhraseRandomLang) => {
    const { audio } = getCurrentTheme();
    const first = get().selectedCards.first;
    set({ selectedCards: { first, second: card } });
    flipCard(card.id); // 0.3s
    await playAudio(audio.cardFlipSound);
    await playAudio(card.sound);
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
    flipCard(first.id);
    flipCard(second.id);
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
    setButtonRef: (buttonRef) => set({ buttonRef }),
    setCardFrontRef: (cardId, frontRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, frontRef } : card)) })),
    setCardBackRef: (cardId, backRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, backRef } : card)) })),
    buttonRef: null,
  };
});

const MemoryGame = ({ themes, narratorPhrases }: MemoryGameProps) => {
  const { playPhraseCurrentLang } = usePlayPhrase();
  const { t } = useTranslation();
  const init = useGameStore((state) => state.init);
  const cards = useGameStore((state) => state.cards);
  const theme = useGameStore((state) => state.getCurrentTheme)();
  const changeTheme = useGameStore((state) => state.changeTheme);
  const restart = useGameStore((state) => state.restart)(playPhraseCurrentLang); // better causes less rerenders
  // const restart = useGameStore((state) => state.restart(playPhraseCurrentLang)); // difference is probably WHEN is function executed
  const scene = useGameStore((state) => state.scene);
  const setButtonRef = useGameStore((state) => state.setButtonRef);

  console.log(narratorPhrases);

  const buttonRef = useCallback(
    (buttonNode) => {
      if (buttonNode === null) return;
      setButtonRef(buttonNode);
    },
    [setButtonRef]
  );

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
            <Image src={theme.image} layout="fill" sizes="25vw" objectFit="cover" alt="card back" priority />
          </div>
        ))}
      </div>
      <div className={styles.app}>
        <Button ref={buttonRef} className={styles.newGameButton} text={t('utils.new_game')} onClick={restart} />
        <div className={styles.board}>
          {scene !== Scene.init && cards.map((card) => <Card key={card.id} card={card} styles={styles} cardBackImage={image} />)}
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
