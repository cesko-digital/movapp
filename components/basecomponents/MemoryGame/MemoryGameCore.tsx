import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { TranslationJSON } from 'utils/Phrase';
import { getCountryVariant } from 'utils/locales';
import phrases_CS from './memory-game-cs.json';
import phrases_PL from './memory-game-pl.json';
import phrases_SK from './memory-game-sk.json';
import createTimer from './createTimer';
import usePlayPhrase from './usePlayPhrase';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (cardsData: Record<string, unknown>[]) =>
  cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));

const GAME_NARRATION_PHRASES = {
  cs: phrases_CS,
  sk: phrases_PL,
  pl: phrases_SK,
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
  id: number;
  flipped: boolean;
  color: string;
};

interface MemoryGameProps {
  audio: {
    cardFlipSound: string;
    cardsMatchSound: string;
    winMusic: string;
  };
  styles: Record<string, string>;
  cardsData: CardData[];
  cardBackImage: string;
}

const MemoryGame = ({ cardsData, audio, styles, cardBackImage }: MemoryGameProps) => {
  const { playCardPhraseOtherLang, playCardPhraseCurrentLang, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();

  const [cards, setCards] = useState<Card[]>([]);

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

  const { cardFlipSound, cardsMatchSound, winMusic } = useMemo(() => {
    const cardFlipSound = new Audio(audio.cardFlipSound);
    cardFlipSound.volume = 0.2;

    const cardsMatchSound = new Audio(audio.cardsMatchSound);
    cardsMatchSound.volume = 0.1;

    const winMusic = new Audio(audio.winMusic);
    winMusic.volume = 0.8;

    return {
      cardFlipSound,
      cardsMatchSound,
      winMusic,
    };
  }, []);

  const newGame = () => {
    console.log('new game');
    // prepare and shuffle cards, pick 8 cards
    const pickedCards = cardsData.sort(() => Math.random() - 0.5).slice(0, 8);
    const coloredCards = addBackroundColor(pickedCards) as (CardData & { color: string })[];

    setCards(
      [...coloredCards, ...coloredCards]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, image: `/kids/${card.image}.svg`, id: Math.random(), flipped: false }))
    );
    setSelectedCards({ first: null, second: null });
    // clearTimers();
  };

  const flipCard = (cardToFlip: Card) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
    cardFlipSound.play();
  };

  const selectCard = (card: Card) => {
    if (controlsDisabled) return;

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
        setScene(Scene.begin);
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
      firstCardSelected: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { first: card } = selectedCards;
        flipCard(card!); // 0.3s
        playCardPhraseOtherLang(card!);

        setTimer(() => {
          setScene(Scene.game);
        }, 600); // reduced for fastrer UX
      },
      secondCardSelected: async () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { second: card } = selectedCards;
        flipCard(card!); // 0.3s

        await playCardPhraseCurrentLang(card!);
        setScene(Scene.resolveCards);
      },
      resolveCards: () => {
        const { first, second } = selectedCards;
        const cardsMatch = first?.image === second?.image;

        if (cardsMatch) {
          console.log('cards match');
          setScene(Scene.cardsMatch);
        } else {
          console.log('cards dont match');
          setScene(Scene.cardsDontMatch);
        }
      },
      cardsMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        // cardsMatch animation 0.7s
        setTimer(() => cardsMatchSound.play(), 100); // sync to animation

        setTimer(() => {
          setScene(Scene.cardsMatchReward);
        }, 700);
      },
      cardsMatchReward: async () => {
        // play css animations and sounds
        Math.random() > 0.5 && (await playPhraseRandomLang(getRandomElement(phrases.good)));
        // reset selected cards
        setSelectedCards({ first: null, second: null });
        // check win
        setTimer(() => {
          if (cards.every((card) => card.flipped)) {
            console.log('win');
            setScene(Scene.win);
          } else {
            setScene(Scene.game);
          }
        }, 700);
      },
      cardsDontMatch: async () => {
        // disable controls
        setControlsDisabled(true);
        // play animations and sounds
        await delay(1000);
        Math.random() > 0.8 && (await playPhraseRandomLang(getRandomElement(phrases.wrong)));

        // setTimer: show cards for some time to remember then flip back
        const { first, second } = selectedCards;
        flipCard(first!);
        flipCard(second!);
        setSelectedCards({ first: null, second: null });
        setScene(Scene.cardsDontMatchFlipBack);
      },
      cardsDontMatchFlipBack: () => {
        // wait for cards flip back
        setTimer(() => {
          setScene(Scene.game);
        }, 300);
      },
      win: async () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        await playPhraseRandomLang(getRandomElement(phrases.win));
        await delay(200);
        setScene(Scene.winReward);
      },
      winReward: () => {
        // play css animations and sounds
        winMusic.play();
      },
      goNewGame: () => {
        clearTimers();
        // play css animations and sounds
        playPhraseRandomLang(getRandomElement(phrases.newGame));
        setTimer(() => {
          setScene(Scene.begin);
        }, 500);
      },
    };
    console.log(`scene is: ${scene}`);
    // run scene actions
    sceneActions[scene]();
  }, [scene]);

  // clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className={styles.app}>
      <Button className={styles.newGameButton} text={t('utils.new_game')} onClick={() => setScene(Scene.goNewGame)} />
      <div className={styles.board}>
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={selectCard}
            card={card}
            scene={scene}
            styles={styles}
            selected={isSelected(card)}
            cardBackImage={cardBackImage}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
