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

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const addBackroundColor = (cardsData: Record<string, unknown>[]) =>
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
interface SelectedCards {
  first: Card | null;
  second: Card | null;
}

const MemoryGame = ({ cardsData, audio, styles, cardBackImage }: MemoryGameProps) => {
  const { playCardPhraseOtherLang, playCardPhraseCurrentLang, playPhraseRandomLang } = usePlayPhrase();
  const { t } = useTranslation();

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

  const [scene, setScene] = useState<Scene | null>(null);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(true);
  const [setTimer, clearTimers] = useMemo(createTimer, []);

  const isSelected = (card: Card) =>
    (selectedCards.first !== null && card.id === selectedCards.first.id) ||
    (selectedCards.second !== null && card.id === selectedCards.second.id);

  useEffect(() => {
    changeSceneTo(Scene.init);
  }, []);

  const sceneActions: Record<Scene, () => void> = {
    init: () => {
      // begin new game automaticaly
      changeSceneTo(Scene.begin);
    },
    begin: () => {
      // new game
      newGame();
      // disable controls
      setControlsDisabled(true);
      // play css animations
      setTimer(() => {
        changeSceneTo(Scene.game);
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
        changeSceneTo(Scene.game);
      }, 600); // reduced for fastrer UX
    },
    secondCardSelected: () => {
      // disable controls
      setControlsDisabled(true);
      // play css animations and sounds
      const { second: card } = selectedCards;
      flipCard(card!); // 0.3s

      playCardPhraseCurrentLang(card!).then(() => {
        changeSceneTo(Scene.resolveCards);
      });
    },
    resolveCards: () => {
      const { first, second } = selectedCards;
      const cardsMatch = first?.image === second?.image;

      if (cardsMatch) {
        console.log('cards match');
        changeSceneTo(Scene.cardsMatch);
      } else {
        console.log('cards dont match');
        changeSceneTo(Scene.cardsDontMatch);
      }
    },
    cardsMatch: () => {
      // disable controls
      setControlsDisabled(true);
      // play css animations and sounds
      // cardsMatch animation 0.7s
      setTimer(() => cardsMatchSound.play(), 100); // sync to animation

      setTimer(() => {
        changeSceneTo(Scene.cardsMatchReward);
      }, 700);
    },
    cardsMatchReward: () => {
      // play css animations and sounds
      if (Math.random() > 0.5) {
        playPhraseRandomLang(getRandomElement(phrases.good));
      }
      // reset selected cards
      setSelectedCards({ first: null, second: null });
      // check win
      setTimer(() => {
        if (cards.every((card) => card.flipped)) {
          console.log('win');
          changeSceneTo(Scene.win);
        } else {
          changeSceneTo(Scene.game);
        }
      }, 700);
    },
    cardsDontMatch: () => {
      // disable controls
      setControlsDisabled(true);
      // play animations and sounds
      setTimeout(() => {
        if (Math.random() > 0.8) {
          playPhraseRandomLang(getRandomElement(phrases.wrong));
        }

        // setTimer: show cards for some time to remember then flip back
        const { first, second } = selectedCards;
        flipCard(first!);
        flipCard(second!);
        setSelectedCards({ first: null, second: null });
        changeSceneTo(Scene.cardsDontMatchFlipBack);
      }, 1000);
    },
    cardsDontMatchFlipBack: () => {
      // wait for cards flip back
      setTimer(() => {
        changeSceneTo(Scene.game);
      }, 300);
    },
    win: () => {
      // disable controls
      setControlsDisabled(true);
      // play css animations and sounds
      playPhraseRandomLang(getRandomElement(phrases.win)).then(() => {
        changeSceneTo(Scene.winReward);
      });
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
        changeSceneTo(Scene.begin);
      }, 500);
    },
  };

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

    const nextCards = { ...selectedCards };
    if (selectedCards.first === null && !card.flipped) {
      nextCards.first = card;
    } else if (selectedCards.second === null && !card.flipped) {
      nextCards.second = card;
    }
    setSelectedCards(nextCards);
  };

  // handle selected cards
  useEffect(() => {
    const { first, second } = selectedCards;
    const bothCardsSelected = first !== null && second !== null;

    if (bothCardsSelected) {
      changeSceneTo(Scene.secondCardSelected);
      return;
    }
    if (first !== null) {
      changeSceneTo(Scene.firstCardSelected);
    }
  }, [selectedCards]);

  const changeSceneTo = (scene: Scene) => {
    console.log(`scene is: ${scene}`);
    // run scene actions
    sceneActions[scene]();
    setScene(scene);
  };

  // clear timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div className={styles.app}>
      <Button className={styles.newGameButton} text={t('utils.new_game')} onClick={() => changeSceneTo(Scene.goNewGame)} />
      <div className={styles.board}>
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={selectCard}
            card={card}
            scene={scene!}
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
