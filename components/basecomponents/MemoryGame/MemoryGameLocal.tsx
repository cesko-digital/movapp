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

interface MemoryGameProps {
  theme: Theme;
}

const MemoryGame = ({ theme }: MemoryGameProps) => {
  const { playCardPhrase, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();
  const [cards, setCards] = useState<Card[]>([]);
  const { audio, image, styles, cardsData } = theme;
  
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

  const flipCard = (cardToFlip: Card) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  };

  const selectCard = (card: Card) => {
    if (controlsDisabled || isSelected(card) || card.flipped) return;

    const { first, second } = selectedCards;
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
      setControlsDisabled(true);
      setCards(createCardDeck(cardsData));
      setSelectedCards({ first: null, second: null });
      setTimer(() => {
        transitions[Transition.game]();
      }, 1000);
    },
    game: () => {
      setScene(Scene.game);
      setControlsDisabled(false);
    },
    firstCardSelected: async (card: Card) => {
      setControlsDisabled(true);
      setSelectedCards({ first: card, second: null });
      setScene(Scene.firstCardSelected);
      // play css animations and sounds
      flipCard(card); // 0.3s
      await playAudio(audio.cardFlipSound);
      playCardPhrase(card);

      setTimer(() => {
        transitions[Transition.game]();
      }, 600); // reduced for fastrer UX
    },
    secondCardSelected: async ({ first, second }: { first: Card; second: Card }) => {
      setControlsDisabled(true);
      setSelectedCards({ first, second });
      setScene(Scene.secondCardSelected);
      // play css animations and sounds
      flipCard(second); // 0.3s
      await playAudio(audio.cardFlipSound);
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
      delay(100);
      await playAudio(audio.cardsMatchSound);
      setScene(Scene.cardsMatchReward);
      Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
      // reset selected cards
      // check win
      if (cards.every((card) => card.flipped)) {
        transitions[Transition.win]();
      } else {
        setSelectedCards({ first: null, second: null });
        transitions[Transition.game]();
      }
    },
    cardsDontMatch: async ({ first, second }: { first: Card; second: Card }) => {
      setScene(Scene.cardsDontMatch);
      await delay(1000);
      Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));
      flipCard(first);
      flipCard(second);
      await playAudio(audio.cardFlipSound);
      setSelectedCards({ first: null, second: null });
      transitions[Transition.game]();
    },
    win: async () => {
      setScene(Scene.win);
      await playPhraseRandomLang(getRandomElement(phrases.win));
      await delay(200);
      setScene(Scene.winReward);
      playAudio(audio.winMusic);
    },
    restart: async () => {
      setControlsDisabled(true);
      playPhraseRandomLang(getRandomElement(phrases.newGame));
      setScene(Scene.goNewGame);
      clearTimers();
      setTimer(() => {
        transitions[Transition.begin]();
      }, 500);
    },
  };

  useEffect(() => {
    console.log('useEffect theme fired');
    transitions[Transition.begin]();
    // clean up
    return () => {
      clearTimers();
    };
  }, [theme,clearTimers]);

  return (
    <div className={styles.app}>
      <Button className={styles.newGameButton} text={t('utils.new_game')} onClick={transitions[Transition.restart]} />
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
