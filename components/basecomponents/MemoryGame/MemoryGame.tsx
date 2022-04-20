import React, { useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation } from 'next-i18next';
import Card from './MemoryGameCard';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import phrases from './MemoryGamePhrases.json';
import cardFlipClip from './card_flip.mp3';
import cardsMatchClip from './cards_match.mp3';
import winMusicClip from './baby_shark.mp3';

const getRandomElement = <Type,>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

export interface CardDataType {
  image: string;
  translation: { [index: string]: string };
  backgroundColor?: string;
}

export interface CardType {
  id: number;
  flipped: boolean;
  image: string;
  translation: { [index: string]: string };
  color?: string;
}

interface MemoryGameProps {
  cardsData: CardDataType[];
}

const addBackroundColor = (cardsData: CardDataType[]) => {
  return cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));
};

const scenes = Object.freeze({
  init: 'init',
  begin: 'begin',
  game: 'game',
  firstCardSelected: 'firstCardSelected',
  secondCardSelected: 'secondCardSelected',
  resolveCards: 'resolveCards',
  cardsMatch: 'cardsMatch',
  cardsMatchReward: 'cardsMatchReward',
  cardsDontMatch: 'cardsDontMatch',
  cardsDontMatchFlipBack: 'cardsDontMatchFlipBack',
  win: 'win',
  winReward: 'winReward',
  goNewGame: 'goNewGame',
});

const cardFlipSound = new Audio(cardFlipClip);
cardFlipSound.volume = 0.2;

const cardsMatchSound = new Audio(cardsMatchClip);
cardsMatchSound.volume = 0.3;

const winMusic = new Audio(winMusicClip);
winMusic.volume = 0.8;

const MemoryGame = ({ cardsData }: MemoryGameProps) => {
  const { otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);

  interface SelectedCards {
    first: CardType | null;
    second: CardType | null;
  }

  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

  const isSelected = (card: CardType) =>
    (selectedCards.first !== null && card.id === selectedCards.first.id) ||
    (selectedCards.second !== null && card.id === selectedCards.second.id);

  const [scene, setScene] = useState<string>(scenes.init);
  const [controlsDisabled, setControlsDisabled] = useState<boolean>(true);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);

  const setTimer = (fn: () => void, delay: number) => {
    const t = setTimeout(() => {
      setTimers((prev) => prev.filter((e) => e !== t));
      fn();
    }, delay);
    setTimers((prev) => [...prev, t]);
  };

  const clearTimers = () => {
    timers.map((t) => clearTimeout(t));
    setTimers([]);
  };

  const newGame = () => {
    console.log('new game');
    // prepare and shuffle cards
    const coloredCards = addBackroundColor(cardsData);
    setCards(
      [...coloredCards, ...coloredCards]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, image: `/kids/${card.image}.svg`, id: Math.random(), flipped: false }))
    );
    setSelectedCards({ first: null, second: null });
    // setTimers([]);
  };

  const playCardWord = (card: CardType) => AudioPlayer.getInstance().playTextToSpeech(card.translation[otherLanguage], otherLanguage);
  const playPhrase = (phrase: { [index: string]: string }) =>
    AudioPlayer.getInstance().playTextToSpeech(phrase[otherLanguage], otherLanguage);

  const flipCard = (cardToFlip: CardType) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
    cardFlipSound.play();
  };

  const selectCard = (card: CardType) => {
    if (controlsDisabled) return;

    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, first: card }));
    } else if (second === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, second: card }));
    }
  };

  // handle selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;

    if (bothCardsSelected) {
      setScene(scenes.secondCardSelected);
      return;
    }
    if (first !== null) {
      setScene(scenes.firstCardSelected);
    }
  }, [selectedCards]);

  // resolve game states
  useEffect(() => {
    const sceneActions: { [index: string]: () => void } = {
      init: () => {
        // begin new game automaticaly
        setScene(scenes.begin);
      },
      begin: () => {
        // new game
        newGame();
        // disable controls
        setControlsDisabled(true);
        // play css animations
        setTimer(() => {
          setScene(scenes.game);
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
        playCardWord(card!); // cca 1.2s
        // go back to game scene when card phrase ends
        setTimer(() => {
          setScene(scenes.game);
        }, 600); // reduced for fastrer UX
      },
      secondCardSelected: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        const { second: card } = selectedCards;
        flipCard(card!); // 0.3s
        playCardWord(card!); // cca 1.2s
        // resolve cards when card phrase ends
        setTimer(() => {
          setScene(scenes.resolveCards);
        }, 1500);
      },
      resolveCards: () => {
        const { first, second } = selectedCards;
        const cardsMatch = first?.image === second?.image;

        if (cardsMatch) {
          console.log('cards match');
          setScene(scenes.cardsMatch);
        } else {
          console.log('cards dont match');
          setScene(scenes.cardsDontMatch);
        }
      },
      cardsMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        // cardsMatch animation 0.7s
        setTimer(() => cardsMatchSound.play(), 100); // sync to animation
        // move on to next scene, wait till card phrase
        setTimer(() => {
          setScene(scenes.cardsMatchReward);
        }, 700);
      },
      cardsMatchReward: () => {
        // play css animations and sounds
        Math.random() > 0.5 && playPhrase(getRandomElement(phrases.good)); // 0.5
        // reset selected cards
        setSelectedCards({ first: null, second: null });
        // check win
        setTimer(() => {
          if (cards.every((card) => card.flipped)) {
            console.log('win');
            setScene(scenes.win);
          } else {
            setScene(scenes.game);
          }
        }, 1200);
      },
      cardsDontMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play animations and sounds
        Math.random() > 0.8 && playPhrase(getRandomElement(phrases.wrong)); // 0.8
        // setTimer: show cards for a period of time to remember then flip back
        setTimer(() => {
          const { first, second } = selectedCards;
          flipCard(first!);
          flipCard(second!);
          setSelectedCards({ first: null, second: null });
          setScene(scenes.cardsDontMatchFlipBack);
        }, 1200);
      },
      cardsDontMatchFlipBack: () => {
        // wait for cards flip back
        setTimer(() => {
          setScene(scenes.game);
        }, 300);
      },
      win: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        playPhrase(getRandomElement(phrases.win));
        setTimer(() => {
          setScene(scenes.winReward);
        }, 1500);
      },
      winReward: () => {
        // play css animations and sounds
        winMusic.play();
      },
      goNewGame: () => {
        // play css animations and sounds
        clearTimers();
        playPhrase(getRandomElement(phrases.newGame));
        setTimer(() => {
          setScene(scenes.begin);
        }, 500);
      },
    };
    console.log(`scene is: ${scene}`);
    // run scene actions
    sceneActions[scene]();
  }, [scene]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button className="bg-primary-blue" text={t('utils.new_game')} onClick={() => setScene(scenes.goNewGame)} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <Card key={card.id} onClick={selectCard} card={card} scene={scene} selected={isSelected(card)} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
