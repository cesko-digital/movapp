import React, { useState, useEffect, useMemo } from 'react';
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
  resolveCards = 'resolveCards',
  cardsMatch = 'cardsMatch',
  cardsMatchReward = 'cardsMatchReward',
  cardsDontMatch = 'cardsDontMatch',
  cardsDontMatchFlipBack = 'cardsDontMatchFlipBack',
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

interface SelectedCards {
  first: Card | null;
  second: Card | null;
}

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

  const setSelectedCards = (selectedCards: SelectedCards) => {
    setState((state) => ({ ...state, selectedCards }));
  };

  const setScene = (scene: Scene) => {
    setState((state) => ({ ...state, scene }));
    updateUI();
    sceneActions[scene]();
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

  const selectCard = (card: Card) => {
    const state = getState();
    if (!state.controlsEnabled || isSelected(card) || card.flipped) return;

    const { first, second } = state.selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards({ ...state.selectedCards, first: card });
    } else if (second === null && !card.flipped) {
      setSelectedCards({ ...state.selectedCards, second: card });
    }
  };

  const playCardPhrase = (card: Card) => {
    Promise.resolve(card);
  };
  const playPhraseRandomLang = (card: { main: string; uk: string }) => {
    Promise.resolve(card);
  };

  const prepareCards = (theme: Theme) => {
    const { cardsData } = theme;
    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
    const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

    const cards = [
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
    return cards;
  };

  const initGame = (theme: Theme) => {
    console.log('init game');
    // init/replace game state with new data

    const cards = prepareCards(theme);

    const initState = {
      theme,
      cards,
      selectedCards: { first: null, second: null },
      scene: Scene.init,
      controlsEnabled: false,
    };

    initializeState(initState);
    updateUI(); // ???????????????????
  };

  const newGame = () => {
    console.log('new game');
    if (state === null) throw new Error('state not initialized');
    initGame(state.theme);
  };

  const handleNewGameClick = () => {
    console.log('new game click');
    setScene(Scene.goNewGame);
  };

  const sceneActions: Record<Scene, () => void> = {
    init: () => {
      // begin new game automaticaly
      // maybe after loading is complete
      setScene(Scene.begin);
    },
    begin: () => {
      // disable controls
      disableControls();
      // play css animations
      setTimer(() => {
        setScene(Scene.game);
      }, 1000);
    },
    game: () => {
      // enable controls
      enableControls();
      updateUI();
    },
    firstCardSelected: async () => {
      // disable controls
      disableControls();
      // play css animations and sounds
      const { first: card } = getState().selectedCards;
      if (!card) return;
      flipCard(card); // 0.3s
      await playAudio(getState().theme.audio.cardFlipSound);
      playCardPhrase(card);

      setTimer(() => {
        setScene(Scene.game);
      }, 600); // reduced for fastrer UX
    },
    secondCardSelected: async () => {
      // disable controls
      disableControls();
      // play css animations and sounds
      const { second: card } = getState().selectedCards;
      if (!card) return;
      flipCard(card); // 0.3s
      await playAudio(getState().theme.audio.cardFlipSound);
      await playCardPhrase(card);
      setScene(Scene.resolveCards);
    },
    resolveCards: () => {
      const { first, second } = getState().selectedCards;
      const cardsMatch = first?.image === second?.image;

      if (cardsMatch) {
        setScene(Scene.cardsMatch);
      } else {
        setScene(Scene.cardsDontMatch);
      }
    },
    cardsMatch: async () => {
      // disable controls
      disableControls();
      // play css animations and sounds
      // cardsMatch animation 0.7s
      delay(100);
      await playAudio(getState().theme.audio.cardsMatchSound); // sync to animation
      setScene(Scene.cardsMatchReward);
    },
    cardsMatchReward: async () => {
      // play css animations and sounds
      Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
      // reset selected cards
      // check win
      if (getState().cards.every((card) => card.flipped)) {
        setScene(Scene.win);
      } else {
        setSelectedCards({ first: null, second: null });
        setScene(Scene.game);
      }
    },
    cardsDontMatch: async () => {
      disableControls();
      // play animations and sounds
      await delay(1000);
      Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));

      // setTimer: show cards for some time to remember then flip back
      const { first, second } = getState().selectedCards;
      if (!first || !second) return;
      flipCard(first);
      flipCard(second);
      await playAudio(getState().theme.audio.cardFlipSound);
      setSelectedCards({ first: null, second: null });
      setScene(Scene.cardsDontMatchFlipBack);
    },
    cardsDontMatchFlipBack: () => {
      // wait for cards flip back
      setScene(Scene.game);
    },
    win: async () => {
      // play css animations and sounds
      await playPhraseRandomLang(getRandomElement(phrases.win));
      await delay(200);
      setScene(Scene.winReward);
    },
    winReward: () => {
      // play css animations and sounds
      playAudio(getState().theme.audio.winMusic);
    },
    goNewGame: () => {
      clearTimers();
      setTimer(() => {
        newGame();
        setScene(Scene.begin);
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

    useEffect(() => {
      // connect ui -> setGame()
      connectUI(() => setGame(getGame()));
      return () => {
        // disconnect ui
        disconnectUI();
      };
    }, []);

    useEffect(() => {
      // init with new data
      initGame(theme);
      // start new game maybe
    }, [theme]);

    return game;
  };

  return useGame;
};

const useGame = createUseGame(/*input data?? maybe not*/);

const MemoryGame = ({ theme }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();
  const { audio, image, styles, cardsData } = theme;

  const game = useGame(theme);

  if (game === null) return null;

  return (
    <div className={styles.app}>
      <Button
        className={styles.newGameButton}
        text={t('utils.new_game')}
        onClick={() => {
          playPhraseRandomLang(getRandomElement(phrases.newGame));
          game.controls.handleNewGameClick();
        }}
      />
      <div className={styles.board}>
        {game.state.scene !== Scene.init &&
          game.state.cards !== null &&
          game.state.cards.map((card) => (
            <Card
              key={card.id}
              onClick={game.controls.selectCard}
              card={card}
              scene={game.state.scene}
              styles={styles}
              selected={game.controls.isSelected(card)}
              cardBackImage={image}
            />
          ))}
      </div>
    </div>
  );
};

export default MemoryGame;
