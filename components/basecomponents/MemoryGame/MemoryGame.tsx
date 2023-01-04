/* eslint-disable no-console */
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
import ImageSuspense from './ImageSuspense';
import AudioSuspense from './AudioSuspense';
import AudioPreload from './AudioPreload';
import { useLoading } from './loadingList';

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
  changeTheme = 'changeTheme',
  changeThemeInGame = 'changeThemeInGame',
  init = 'init',
  ready = 'ready',
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
  buttonImage?: string;
};

interface MemoryGameProps {
  theme: Theme;
}

const MemoryGame = ({ theme }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const { audio, image, styles, cardsData, buttonImage } = theme;

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

  const { loadingPromise } = useLoading();

  const newGame = () => {
    // preload sounds
    // const winMusic = new Audio();
    // winMusic.src = audio.winMusic;
    // winMusic.load();

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
      changeTheme: async () => {
        if (loadingPromise instanceof Promise) await loadingPromise;
        setScene(Scene.ready);
      },
      changeThemeInGame: async () => {
        if (loadingPromise instanceof Promise) await loadingPromise;
        setScene(Scene.begin);
      },
      init: () => {
        // initial state on first run
        setScene(Scene.ready);
      },
      ready: () => {
        // ready to new game
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

    console.log(`scene set to ${scene}`);
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

  // handle theme change
  useEffect(() => {
    if (scene === Scene.ready) {
      setScene(Scene.changeTheme);
      // when in-game
    } else if (scene !== Scene.init) {
      clearTimers();
      setScene(Scene.changeThemeInGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div className={styles.app}>
      <AudioPreload src={audio.winMusic} />
      <AudioSuspense src={audio.cardFlipSound} />
      <AudioSuspense src={audio.cardsMatchSound} />
      <div className={styles.buttonWrapper}>
        {buttonImage !== undefined && <ImageSuspense src={buttonImage} alt="new game button" />}
        <Button
          className={styles.newGameButton}
          text={t('utils.new_game')}
          onClick={() => {
            playPhraseRandomLang(getRandomElement(phrases.newGame));
            setScene(Scene.goNewGame);
          }}
        />
      </div>
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
  );
};

export default MemoryGame;
