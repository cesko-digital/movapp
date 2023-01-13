import React, { useState, useEffect } from 'react';
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

const playAudio = AudioPlayer.getInstance().playSrc;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (cardsData: CardData[]) =>
  cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));

const createCardDeck = (cardsData: CardData[]) => {
  // prepare and shuffle cards, pick 8 cards
  console.log('creating carddeck');
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

enum Scene {
  init = 'init',
  begin = 'begin',
  game = 'game',
  firstCardSelected = 'firstCardSelected',
  secondCardSelected = 'secondCardSelected',
  cardsMatch = 'cardsMatch',
  cardsMatchReward = 'cardsMatchReward',
  cardsDontMatch = 'cardsDontMatch',
  win = 'win',
  winReward = 'winReward',
  goNewGame = 'goNewGame',
}

enum Transition {
  begin = 'begin',
  game = 'game',
  firstCardSelected = 'firstCardSelected',
  secondCardSelected = 'secondCardSelected',
  cardsMatch = 'cardsMatch',
  cardsDontMatch = 'cardsDontMatch',
  win = 'win',
  restart = 'restart',
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

interface SelectedCards {
  first: Card | null;
  second: Card | null;
}

interface MemoryGameProps {
  theme: Theme;
}

const createUseGame = () => {
  interface State {
    theme: Theme;
    cards: Card[];
    selectedCards: SelectedCards;
    scene: Scene;
    controlsEnabled: boolean;
  }

  let state: State | null = null;

  let playCardPhrase: (card: Card) => Promise<void> = () => Promise.resolve();
  let playPhraseRandomLang: (phrase: TranslationJSON) => Promise<void> = () => Promise.resolve();

  const setPlayPhrase = (playPhrase: {
    playCardPhrase: (card: Card) => Promise<void>;
    playPhraseRandomLang: (phrase: TranslationJSON) => Promise<void>;
  }) => {
    playCardPhrase = playPhrase.playCardPhrase;
    playPhraseRandomLang = playPhrase.playPhraseRandomLang;
  };

  const initializeState = (initState: State) => {
    console.log('initialize state');
    state = initState;
    console.log(state);
  };

  const setState = (func: (state: State) => State) => {
    console.log('update state');
    if (state === null) throw new Error('state not initialized');
    state = { ...state, ...func(state) };
    console.log(state);
  };

  const getState = () => {
    if (state === null) throw new Error('state not initialized');
    return state;
  };

  const [setTimer, clearTimers] = createTimer();

  const isSelected = (card: Card) => {
    const { selectedCards } = getState();
    return (
      (selectedCards.first !== null && card.id === selectedCards.first.id) ||
      (selectedCards.second !== null && card.id === selectedCards.second.id)
    );
  };

  const setCards = (cards: Card[]) => {
    setState((state) => ({ ...state, cards }));
  };

  const setScene = (scene: Scene) => {
    setState((state) => ({ ...state, scene }));
  };

  const setSelectedCards = (selectedCards: SelectedCards) => {
    setState((state) => ({ ...state, selectedCards }));
  };

  const disableControls = () => {
    setState((state) => ({ ...state, controlsEnabled: false }));
  };

  const enableControls = () => {
    setState((state) => ({ ...state, controlsEnabled: true }));
  };

  const flipCard = (cardToFlip: Card) => {
    console.log('flipp card');
    setCards(getState().cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  };

  const initGame = (theme: Theme) => {
    console.log('init game');
    // init/replace game state with new data
    const cards = createCardDeck(theme.cardsData);

    const initState = {
      theme,
      cards,
      selectedCards: { first: null, second: null },
      scene: Scene.init,
      controlsEnabled: false,
    };

    initializeState(initState);
  };

  const handleNewGameClick = () => {
    console.log('new game click');
    transitions[Transition.restart]();
  };

  const selectCard = (card: Card) => {
    const state = getState();
    if (!state.controlsEnabled || isSelected(card) || card.flipped) return;

    const { first, second } = state.selectedCards;
    // select first card
    if (first === null && !card.flipped) {
      transitions[Transition.firstCardSelected](card);
      // select second card
    } else if (first !== null && second === null && !card.flipped) {
      transitions[Transition.secondCardSelected]({ first, second: card });
    }
  };

  const transitions = {
    begin: () => {
      setScene(Scene.begin);
      disableControls();
      updateUI();
      setTimer(() => {
        transitions[Transition.game]();
      }, 1000);
    },
    game: () => {
      setScene(Scene.game);
      enableControls();
      updateUI();
    },
    firstCardSelected: async (card: Card) => {
      disableControls();
      setSelectedCards({ first: card, second: null });
      setScene(Scene.firstCardSelected);
      // play css animations and sounds
      flipCard(card); // 0.3s
      updateUI();
      await playAudio(getState().theme.audio.cardFlipSound);
      playCardPhrase(card);

      setTimer(() => {
        transitions[Transition.game]();
      }, 600); // reduced for fastrer UX
    },
    secondCardSelected: async ({ first, second }: { first: Card; second: Card }) => {
      disableControls();
      setSelectedCards({ first, second });
      setScene(Scene.secondCardSelected);
      // play css animations and sounds
      flipCard(second); // 0.3s
      updateUI();
      await playAudio(getState().theme.audio.cardFlipSound);
      await playCardPhrase(second);

      const cardsMatch = first.image === second.image;

      if (cardsMatch) {
        transitions[Transition.cardsMatch]();
      } else {
        transitions[Transition.cardsDontMatch]({ first, second });
      }
    },
    cardsMatch: async () => {
      setScene(Scene.cardsMatch);
      updateUI();
      delay(100);
      await playAudio(getState().theme.audio.cardsMatchSound);
      setScene(Scene.cardsMatchReward);
      updateUI();
      Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
      // reset selected cards
      // check win
      if (getState().cards.every((card) => card.flipped)) {
        transitions[Transition.win]();
      } else {
        setSelectedCards({ first: null, second: null });
        transitions[Transition.game]();
      }
    },
    cardsDontMatch: async ({ first, second }: { first: Card; second: Card }) => {
      setScene(Scene.cardsDontMatch);
      updateUI();
      await delay(1000);
      Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));
      flipCard(first);
      flipCard(second);
      updateUI();
      await playAudio(getState().theme.audio.cardFlipSound);
      setSelectedCards({ first: null, second: null });
      transitions[Transition.game]();
    },
    win: async () => {
      setScene(Scene.win);
      updateUI();
      await playPhraseRandomLang(getRandomElement(phrases.win));
      await delay(200);
      setScene(Scene.winReward);
      updateUI();
      playAudio(getState().theme.audio.winMusic);
    },
    restart: async () => {
      disableControls();
      playPhraseRandomLang(getRandomElement(phrases.newGame));
      setScene(Scene.goNewGame);
      updateUI();
      clearTimers();
      setTimer(() => {
        initGame(getState().theme);
        transitions[Transition.begin]();
      }, 500);
    },
  };

  interface Controls {
    selectCard: (card: Card) => void;
    isSelected: (card: Card) => boolean;
    handleNewGameClick: () => void;
  }

  const controls = { selectCard, isSelected, handleNewGameClick };

  interface Game {
    state: State;
    controls: Controls;
  }

  const getGame = () => (state === null ? null : { state, controls });

  let uiCallback: null | (() => void) = null;
  const connectUI = (func: () => void) => {
    console.log('connect ui');
    uiCallback = func;
  };
  const disconnectUI = () => (uiCallback = null);
  const updateUI = () => {
    if (uiCallback !== null) {
      console.log('update ui');
      uiCallback();
    }
  };

  const useGame = (theme: Theme) => {
    const [game, setGame] = useState<Game | null>(null);
    const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();

    useEffect(() => {
      connectUI(() => setGame(getGame()));
      return () => {
        // disconnect ui
        disconnectUI();
      };
    }, []);

    useEffect(() => {
      setPlayPhrase({ playCardPhrase, playPhraseRandomLang });
    }, [playCardPhrase, playPhraseRandomLang]);

    useEffect(() => {
      // init with new data
      initGame(theme);
      transitions[Transition.begin]();
      // start new game maybe
    }, [theme]);

    return game;
  };

  return useGame;
};

const useGame = createUseGame();

const MemoryGame = ({ theme }: MemoryGameProps) => {
  const { t } = useTranslation();

  const game = useGame(theme);
  if (game === null) return null;

  const { scene, cards } = game.state;
  const { image, styles } = game.state.theme;
  const { isSelected, selectCard, handleNewGameClick } = game.controls;

  return (
    <div className={styles.app}>
      <Button className={styles.newGameButton} text={t('utils.new_game')} onClick={handleNewGameClick} />
      <div className={styles.board}>
        {scene !== Scene.init &&
          cards !== null &&
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
  );
};

export default MemoryGame;
