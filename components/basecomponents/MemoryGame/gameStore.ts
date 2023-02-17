import React from 'react';
import Card from './MemoryGameCard';
import { Phrase, fetchRawDictionary } from 'utils/getDataUtils';
import createTimer from 'utils/timer';
import getThemes from './getThemes';
import { Language, getCountryVariant } from 'utils/locales';
import { createNarrator, Category, NarratorPhrase } from 'utils/narrator';
import { AudioPlayer } from 'utils/AudioPlayer';
import createCancelablePromiseStore from 'utils/cancelablePromiseStore';
import { create } from 'zustand';
//import anime from 'animejs';

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
  initialized: boolean;
  lang: { currentLanguage: Language; otherLanguage: Language };
  _narrator: ((category: Category) => NarratorPhrase<Promise<void>>) | null;
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
  selectCard: (card: Card) => void;
  isSelected: (cardId: Card['id']) => boolean;
  setCardFrontRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setCardBackRef: (cardId: Card['id'], ref: React.LegacyRef<HTMLDivElement>) => void;
  setButtonRef: (ref: React.Ref<HTMLButtonElement>) => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  const [setTimer, clearTimers] = createTimer();
  const [makeCancelable, cancelAllPromises] = createCancelablePromiseStore();

  // const pauseAnimations = () => {
  //   anime.running.map((anim) => {
  //     anim.restart();
  //     anim.pause();
  //   });
  // };

  const _playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
  const playAudio = (str: string) => makeCancelable(_playAudio(str));
  const pauseAudio = () => AudioPlayer.getInstance().pause();
  const delay = (ms: number) => makeCancelable(new Promise((resolve) => setTimeout(resolve, ms)));

  const narrator = (category: Category) => {
    const _narrator = get()._narrator;
    if (_narrator === null) throw Error('narrator is not initialized');
    return _narrator(category);
  };

  const setScene = (scene: Scene) => set({ scene });
  const disableControls = () => set({ controlsDisabled: true });
  const enableControls = () => set({ controlsDisabled: false });
  const isSelected = (cardId: Card['id']) => {
    const { first, second } = get().selectedCards;
    return (first !== null && cardId === first.id) || (second !== null && cardId === second.id);
  };
  const clearSelectedCards = () => set({ selectedCards: { first: null, second: null } });
  const flipCard = (cardId: Card['id']) =>
    set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, flipped: !card.flipped } : card)) }));

  const increaseId = () => set((state) => ({ id: state.id + 1 }));

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

  const reset = () => {
    pauseAudio();
    //pauseAnimations();
    cancelAllPromises();
    clearTimers();
    increaseId();
    disableControls();
  };

  return {
    id: 0,
    initialized: false,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    _narrator: null,
    themes: [],
    currentThemeIndex: 2,
    cards: [],
    selectedCards: { first: null, second: null },
    scene: Scene.init,
    controlsDisabled: true,
    buttonRef: null,
    getTheme: () => get().themes[get().currentThemeIndex],
    init: async () => {
      const dictionary = await fetchRawDictionary();
      set({
        _narrator: createNarrator(
          dictionary,
          () => get().lang.currentLanguage,
          () => get().lang.otherLanguage,
          playAudio
        ),
        themes: getThemes(dictionary),
        initialized: true,
      });
      begin();
    },
    restart: () => {
      reset();
      setScene(Scene.goNewGame);
      narrator(Category.newGame)
        .playCurrentLanguage()
        .catch(() => undefined);
      setTimer(begin, 500);
    },
    changeTheme: (index) => {
      reset();
      setScene(Scene.goNewGame);
      setTimer(() => {
        set({ currentThemeIndex: index });
        begin();
      }, 500);
    },
    selectCard: async (card: Card) => {
      try {
        if (get().controlsDisabled || isSelected(card.id) || card.flipped) return;
        disableControls();

        const { first, second } = get().selectedCards;
        const { audio } = getCurrentTheme();

        if (first === null && !card.flipped) {
          /* Select first card */
          set({ selectedCards: { first: card, second: null } });
          flipCard(card.id); // 0.3s
          await playAudio(audio.cardFlipSound);
          _playAudio(card.sound);
          setTimer(() => {
            game();
          }, 600); // reduced for fastrer UI
        } else if (first !== null && second === null && !card.flipped) {
          /* Select second card */
          set((state) => ({ selectedCards: { ...state.selectedCards, second: card } }));
          flipCard(card.id); // 0.3s
          await playAudio(audio.cardFlipSound);
          await playAudio(card.sound);
          // check if cards match
          if (first !== null && first.image === card.image) {
            /* Cards match */
            setScene(Scene.cardsMatch);
            await delay(100);
            await playAudio(audio.cardsMatchSound);
            setScene(Scene.cardsMatchReward);
            Math.random() > 0.5 && (await narrator(Category.good).playCurrentLanguage());
            // reset selected cards
            clearSelectedCards();
            // check win
            if (get().cards.every((card) => card.flipped)) {
              /* Game win */
              setScene(Scene.win);
              await narrator(Category.win).playCurrentLanguage();
              await delay(200);
              setScene(Scene.winReward);
              _playAudio(audio.winMusic);
            } else {
              game();
            }
          } else {
            /* Cards don't match */
            const { first, second } = get().selectedCards;
            setScene(Scene.cardsDontMatch);
            Math.random() > 0.5 ? await narrator(Category.wrong).playCurrentLanguage() : await delay(1000);
            if (first === null || second === null) return;
            flipCard(first.id);
            flipCard(second.id);
            clearSelectedCards();
            await playAudio(audio.cardFlipSound);
            game();
          }
        }
      } catch (e) {}
    },
    setLang: (lang) => set({ lang }),
    isSelected,
    setButtonRef: (buttonRef) => set({ buttonRef }),
    setCardFrontRef: (cardId, frontRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, frontRef } : card)) })),
    setCardBackRef: (cardId, backRef) =>
      set((state) => ({ cards: state.cards.map((card) => (card.id === cardId ? { ...card, backRef } : card)) })),
  };
});
