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
    count: number;
    theme: Theme;
    cards: Card[];
    selectedCards: SelectedCards;
    scene: Scene;
    controlsEnabled: Boolean;
  }

  // let state: State = { count: 0, theme: null, cards: null, selectedCards: { first: null, second: null }, scene: Scene.init, controlsEnabled: false };
  let state: State | null = null;

  const setState = (func: (state: State) => State) => {
    console.log('update state');
    if (state === null) throw new Error('state not initialized');
    state = { ...state, ...func(state) };
    console.log(state);
  };

  const [setTimer, clearTimers] = createTimer();

  const handleCount = () => {
    console.log(`handle count`);
    setState((state) => ({ ...state, count: state.count + 1 }));
    updateUI();
  };
  // const isSelected = (card: Card) =>
  //   (selectedCards.first !== null && card.id === selectedCards.first.id) ||
  //   (selectedCards.second !== null && card.id === selectedCards.second.id);

  const isSelected = (card: Card) => false;

  const setCards = (cards: Card[]) => {
    setState((state) => ({ ...state, cards }));
  };

  const setSelectedCards = (selectedCards: SelectedCards) => {
    setState((state) => ({ ...state, selectedCards }));
  };

  const setTheme = (theme: Theme) => {
    setState((state) => ({ ...state, theme }));
  };

  const setScene = (scene: Scene) => {
    if (state === null) throw new Error('state not initialized');
    setState((state) => ({ ...state, scene }));
    updateUI();
    sceneActions[scene](state);
  };

  const disableControls = () => {
    setState((state) => ({ ...state, controlsEnabled: false }));
  };

  const enableControls = () => {
    setState((state) => ({ ...state, controlsEnabled: true }));
  };

  const flipCard = (cardToFlip: Card) => {
    console.log('flipp card');
    if (state === null) throw new Error('state not initialized');
    setCards(state.cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  };

  const selectCard = (card: Card) => {
    if (state === null) throw new Error('state not initialized');
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
  const playPhraseRandomLang = (card: { main: string; uk: string; }) => {
    Promise.resolve(card);
  };

  const initGame = (theme: Theme) => {
    console.log('init game');
    // init/replace game state with new data

    const { audio, image, styles, cardsData } = theme;
    setTheme(theme);

    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
    const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

    setCards(
      [
        ...coloredCards.map((card, index) => ({
          ...card,
          image: card.image,
          id: `card-other-${index}`,
          flipped: true,
          useMainLang: false,
        })),
        ...coloredCards.map((card, index) => ({
          ...card,
          image: card.image,
          id: `card-main-${index}`,
          flipped: true,
          useMainLang: true,
        })),
      ].sort(() => Math.random() - 0.5)
    );

    setSelectedCards({ first: null, second: null });
    setScene(Scene.init);
  };

  const newGame = () => {
    console.log('new game');
    if (state === null) throw new Error('state not initialized');
    initGame(state.theme);
  };

  const sceneActions: Record<Scene, (state: State) => void> = {
    init: () => {
      // begin new game automaticaly
      setScene(Scene.begin);
    },
    begin: () => {
      // new game
      newGame();
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
    },
    firstCardSelected: async (state) => {
      // disable controls
      disableControls();
      // play css animations and sounds
      const { first: card } = state.selectedCards;
      if (!card) return;
      flipCard(card); // 0.3s
      await playAudio(state.theme.audio.cardFlipSound);
      playCardPhrase(card);

      setTimer(() => {
        setScene(Scene.game);
      }, 600); // reduced for fastrer UX
    },
    secondCardSelected: async (state) => {
      // disable controls
      disableControls();
      // play css animations and sounds
      const { second: card } = state.selectedCards;
      if (!card) return;
      flipCard(card); // 0.3s
      await playAudio(state.theme.audio.cardFlipSound);
      await playCardPhrase(card);
      setScene(Scene.resolveCards);
    },
    resolveCards: (state) => {
      const { first, second } = state.selectedCards;
      const cardsMatch = first?.image === second?.image;

      if (cardsMatch) {
        setScene(Scene.cardsMatch);
      } else {
        setScene(Scene.cardsDontMatch);
      }
    },
    cardsMatch: async (state) => {
      // disable controls
      disableControls();
      // play css animations and sounds
      // cardsMatch animation 0.7s
      delay(100);
      await playAudio(state.theme.audio.cardsMatchSound); // sync to animation
      setScene(Scene.cardsMatchReward);
    },
    cardsMatchReward: async (state) => {
      // play css animations and sounds
      Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
      // reset selected cards
      // check win
      if (state.cards.every((card) => card.flipped)) {
        setScene(Scene.win);
      } else {
        setSelectedCards({ first: null, second: null });
        setScene(Scene.game);
      }
    },
    cardsDontMatch: async (state) => {
      disableControls();
      // play animations and sounds
      await delay(1000);
      Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));

      // setTimer: show cards for some time to remember then flip back
      const { first, second } = state.selectedCards;
      if (!first || !second) return;
      flipCard(first);
      flipCard(second);
      await playAudio(state.theme.audio.cardFlipSound);
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
    winReward: (state) => {
      // play css animations and sounds
      playAudio(state.theme.audio.winMusic);
    },
    goNewGame: () => {
      clearTimers();
      // play css animations and sounds
      setTimer(() => {
        setScene(Scene.begin);
      }, 500);
    },
  };

  const controls = { selectCard, isSelected, handleCount };

  const getGame = () => ({ state, controls });

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
    const [game, setGame] = useState(getGame());

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

const MemoryGameOld = ({ theme }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const { audio, image, styles, cardsData } = theme;

  const game = useGame(theme);

  interface SelectedCards {
    first: Card | null;
    second: Card | null;
  }

  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

  const isSelected = (card: Card) =>
    (selectedCards.first !== null && card.id === selectedCards.first.id) ||
    (selectedCards.second !== null && card.id === selectedCards.second.id);

  const [scene, setScene] = useState<Scene>(Scene.init);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(true);
  const [setTimer, clearTimers] = useMemo(createTimer, []);

  const newGame = () => {
    // prepare and shuffle cards, pick 8 cards
    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
    const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

    setCards(
      [
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
      ].sort(() => Math.random() - 0.5)
    );
    setSelectedCards({ first: null, second: null });
  };

  const flipCard = (cardToFlip: Card) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  };

  const selectCard = (card: Card) => {
    if (controlsDisabled || isSelected(card) || card.flipped) return;

    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards({ ...selectedCards, first: card });
    } else if (second === null && !card.flipped) {
      setSelectedCards({ ...selectedCards, second: card });
    }
  };

  // handle selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;

    if (bothCardsSelected) {
      setScene(Scene.secondCardSelected);
      return;
    }
    if (first !== null) {
      setScene(Scene.firstCardSelected);
    }
  }, [selectedCards]);

  // resolve game states
  useEffect(() => {
    const sceneActions: Record<Scene, () => void> = {
      init: () => {
        // begin new game automaticaly
        //setScene(Scene.begin);
      },
      begin: () => {
        // new game
        newGame();
        // disable controls
        setControlsDisabled(true);
        // play css animations
        setTimer(() => {
          setScene(Scene.game);
        }, 1000);
      },
      game: () => {
        // enable controls
        setControlsDisabled(false);
      },
      firstCardSelected: async () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { first: card } = selectedCards;
        if (!card) return;
        flipCard(card); // 0.3s
        await playAudio(audio.cardFlipSound);
        playCardPhrase(card);

        setTimer(() => {
          setScene(Scene.game);
        }, 600); // reduced for fastrer UX
      },
      secondCardSelected: async () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { second: card } = selectedCards;
        if (!card) return;
        flipCard(card); // 0.3s
        await playAudio(audio.cardFlipSound);
        await playCardPhrase(card);
        setScene(Scene.resolveCards);
      },
      resolveCards: () => {
        const { first, second } = selectedCards;
        const cardsMatch = first?.image === second?.image;

        if (cardsMatch) {
          setScene(Scene.cardsMatch);
        } else {
          setScene(Scene.cardsDontMatch);
        }
      },
      cardsMatch: async () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        // cardsMatch animation 0.7s
        delay(100);
        await playAudio(audio.cardsMatchSound); // sync to animation
        setScene(Scene.cardsMatchReward);
      },
      cardsMatchReward: async () => {
        // play css animations and sounds
        Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
        // reset selected cards
        // check win
        if (cards.every((card) => card.flipped)) {
          setScene(Scene.win);
        } else {
          setSelectedCards({ first: null, second: null });
          setScene(Scene.game);
        }
      },
      cardsDontMatch: async () => {
        setControlsDisabled(true);
        // play animations and sounds
        await delay(1000);
        Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));

        // setTimer: show cards for some time to remember then flip back
        const { first, second } = selectedCards;
        if (!first || !second) return;
        flipCard(first);
        flipCard(second);
        await playAudio(audio.cardFlipSound);
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
        playAudio(audio.winMusic);
      },
      goNewGame: () => {
        clearTimers();
        // play css animations and sounds
        setTimer(() => {
          setScene(Scene.begin);
        }, 500);
      },
    };

    // run scene actions
    sceneActions[scene]();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // restart game when theme changes but not on initial game open
  // clear timers on restart
  useEffect(() => {
    if (scene !== Scene.init) {
      clearTimers();
      setScene(Scene.begin);
    }
  }, [theme]);

  useEffect(() => {
    // game.controls.initGame({count:5}); // init with theme data
  }, [theme]);

  return (
    <div className={styles.app}>
      <Button text="Count" onClick={game.controls.handleCount} />
      <p>{game.state.count}</p>
      <Button
        className={styles.newGameButton}
        text={t('utils.new_game')}
        onClick={() => {
          playPhraseRandomLang(getRandomElement(phrases.newGame));
          setScene(Scene.goNewGame);
        }}
      />
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

const MemoryGame = ({ theme }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();
  const { audio, image, styles, cardsData } = theme;

  const game = useGame(theme);

  if (game.state === null) return null;
  
  return (
    <div className={styles.app}>      
      <Button text="Count" onClick={game.controls.handleCount} />
      <p>{game.state.count}</p>
      <Button
        className={styles.newGameButton}
        text={t('utils.new_game')}
        onClick={() => {
          playPhraseRandomLang(getRandomElement(phrases.newGame));
          //setScene(Scene.goNewGame);
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
