import React from 'react';
import Card from './MemoryGameCard';
import { Phrase, fetchDictionaryForGame } from 'utils/getDataUtils';
import createTimer from './createTimer';
import getThemes from './getThemes';
import { Language, getCountryVariant } from 'utils/locales';
import { createNarrator, Category, Narrator } from './narrator';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import anime from 'animejs';

const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const addBackroundColor = (phrases: Phrase[]) =>
  phrases.map((item, i) => ({ ...item, color: `hsl(${(360 / phrases.length) * i},50%,50%)` }));

const createCardDeck = (phrases: Phrase[], gameId: number) => {
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

export interface GameStore {
  id: number;
  lang: { currentLanguage: Language; otherLanguage: Language };
  _narrator: Narrator;
  themes: Theme[];
  currentThemeIndex: number;
  cards: Card[];
  selectedCards: SelectedCards;
  scene: Scene;
  controlsDisabled: boolean;
  buttonRef: React.Ref<HTMLButtonElement> | null;
  init: () => void;
  restart: () => void;
  getTheme: () => Theme;
  changeTheme: (index: number) => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
  // setNarrator: (narrator: Narrator) => void;
  selectCard: (card: Card) => void;
  isSelected: (cardId: Card['id']) => boolean;
  setCardFrontRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setCardBackRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setButtonRef: (ref: React.Ref<HTMLButtonElement>) => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  const [setTimer, clearTimers] = createTimer();

  // const narrator = createNarratorInterface(
  //   () => get()._narrator,
  //   () => get().lang.currentLanguage,
  //   () => get().lang.otherLanguage
  // );

  const narrator = 

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

  const begin = () => {
    set((state) => ({
      cards: createCardDeck(state.themes[state.currentThemeIndex].phrases, get().id),
      selectedCards: { first: null, second: null },
      scene: Scene.begin,
    }));
    setTimer(game, 1000);
  };

  const game = () => {
    setScene(Scene.game);
    enableControls();
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

  const selectSecondCard = async (card: Card) => {
    const { audio } = getCurrentTheme();
    const first = get().selectedCards.first;
    set({ selectedCards: { first, second: card } });
    flipCard(card.id); // 0.3s
    await playAudio(audio.cardFlipSound);
    await playAudio(card.sound);
    // check if cards match
    if (first !== null && first.image === card.image) {
      cardsMatch();
    } else {
      cardsDontMatch();
    }
  };

  const cardsMatch = async () => {
    const { audio } = getCurrentTheme();
    setScene(Scene.cardsMatch);
    delay(100);
    await playAudio(audio.cardsMatchSound);
    setScene(Scene.cardsMatchReward);
    Math.random() > 0.5 && (await narrator.randomLanguage(Category.good));
    // reset selected cards
    set({ selectedCards: { first: null, second: null } });
    // check win
    if (get().cards.every((card) => card.flipped)) {
      win();
    } else {
      game();
    }
  };

  const cardsDontMatch = async () => {
    const { audio } = getCurrentTheme();
    const { first, second } = get().selectedCards;
    const checkId = createIdCheck(get().id);
    setScene(Scene.cardsDontMatch);
    await delay(1000);
    Math.random() > 0.8 && (await narrator.randomLanguage(Category.wrong));
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

  const win = async () => {
    setScene(Scene.win);
    await narrator.randomLanguage(Category.win);
    await delay(200);
    setScene(Scene.winReward);
    playAudio(getCurrentTheme().audio.winMusic);
  };

  return {
    id: 0,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    _narrator: null,
    themes: [],
    currentThemeIndex: 0,
    cards: [],
    selectedCards: { first: null, second: null },
    scene: Scene.init,
    controlsDisabled: true,
    buttonRef: null,
    getTheme: () => get().themes[get().currentThemeIndex],
    init: async () => {
      const dictionary = await fetchDictionaryForGame();
      console.log(`init game id:${get().id}`);
      clearTimers();
      increaseId();
      disableControls();
      set({
        _narrator: createNarrator(
          dictionary,
          () => get().lang.currentLanguage,
          () => get().lang.otherLanguage
        ),
        themes: getThemes(dictionary),
        currentThemeIndex: 2,
      });
      begin();
    },
    restart: () => {
      clearTimers();
      increaseId();
      disableControls();
      setScene(Scene.goNewGame);
      narrator.randomLanguage(Category.newGame);
      setTimer(begin, 500);
    },
    changeTheme: (index) => {
      clearTimers();
      increaseId();
      disableControls();
      setScene(Scene.goNewGame);
      setTimer(() => {
        set({ currentThemeIndex: index });
        begin();
      }, 500);
    },
    setLang: (lang) => set({ lang }),
    // setNarrator: (narrator) => set({ narrator }),
    isSelected,
    selectCard: async (card: Card) => {
      if (get().controlsDisabled || isSelected(card.id) || card.flipped) return;
      disableControls();
      anime({ targets: card.backRef, opacity: 0.5 });
      const { first, second } = get().selectedCards;
      if (first === null && !card.flipped) {
        selectFirstCard(card);
      } else if (first !== null && second === null && !card.flipped) {
        selectSecondCard(card);
      }
    },
    setButtonRef: (buttonRef) => set({ buttonRef }),
    setCardFrontRef: (cardId, frontRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, frontRef } : card)) })),
    setCardBackRef: (cardId, backRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, backRef } : card)) })),
  };
});
