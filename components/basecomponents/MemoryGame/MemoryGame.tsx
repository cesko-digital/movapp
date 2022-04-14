import React, { useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation, Trans } from 'next-i18next';
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
  game: 'game',
  begin: 'begin',
  cardsMatch: 'cardsMatch',
  cardsMatchReward: 'cardsMatchReward',
  cardsDontMatch: 'cardsDontMatch',
  cardsDontMatchReward: 'cardsDontMatchReward',
  win: 'win',
  winReward: 'winReward',
});

const cardFlipSound = new Audio(cardFlipClip);
cardFlipSound.volume = 0.2;

const cardsMatchSound = new Audio(cardsMatchClip);
cardsMatchSound.volume = 0.3;

const winMusic = new Audio(winMusicClip);
winMusic.volume = 0.8;

const MemoryGame = ({ cardsData }: MemoryGameProps) => {
  const { currentLanguage, otherLanguage } = useLanguage();
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
  };

  const playCardWord = (card: CardType) => AudioPlayer.getInstance().playTextToSpeech(card.translation[otherLanguage], otherLanguage);
  const playPhrase = (phrase: { [index: string]: string }) =>
    AudioPlayer.getInstance().playTextToSpeech(phrase[otherLanguage], otherLanguage);

  const flippCard = (cardToFlip: CardType) => {
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
    cardFlipSound.play();
  };
  // TODO: play flippcard sound...maybe

  const selectCard = (card: CardType) => {
    if (controlsDisabled) return;

    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, first: card }));
      flippCard(card);
      playCardWord(card);
    } else if (!second && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, second: card }));
      flippCard(card);
      playCardWord(card);
    }
  };

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
        // play css animations and sounds, play phrase
        playPhrase(getRandomElement(phrases.newGame));
        // setTimeout: set scene game
        setTimeout(() => {
          setScene(scenes.game);
        }, 1500);
      },
      game: () => {
        // enable controls
        setControlsDisabled(false);
      },
      cardsMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        setTimeout(() => cardsMatchSound.play(), 700);
        // move on to next scene
        setTimeout(() => {
          setScene(scenes.cardsMatchReward);
        }, 1000);
      },
      cardsMatchReward: () => {
        // play css animations and sounds
        Math.random() > 0.5 && playPhrase(getRandomElement(phrases.good));
        // reset selected cards
        setSelectedCards({ first: null, second: null });
        // check win
        setTimeout(() => {
          if (cards.every((card) => card.flipped)) {
            console.log('win');
            setScene(scenes.win);
          } else {
            setScene(scenes.game);
          }
        }, 1500);
      },
      cardsDontMatch: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds, flip card and card word
        // setTimeout: show cards for a period of time to remember
        setTimeout(() => {
          setScene(scenes.cardsDontMatchReward);
        }, 1000);
      },
      cardsDontMatchReward: () => {
        // play animations and sounds
        Math.random() > 0.8 && playPhrase(getRandomElement(phrases.wrong));
        // setTimeout: set scene game; delay till phrase ends
        setTimeout(() => {
          // flip cards back
          const { first, second } = selectedCards;
          flippCard(first!);
          flippCard(second!);
          setSelectedCards({ first: null, second: null });
          setScene(scenes.game);
        }, 1500);
      },
      win: () => {
        // disable controls
        setControlsDisabled(true);
        // play css animations and sounds
        playPhrase(getRandomElement(phrases.good));
        setTimeout(() => {
          setScene(scenes.winReward);
        }, 1500);
      },
      winReward: () => {
        // play css animations and sounds
        winMusic.play();
      },
    };
    console.log(`scene is: ${scene}`);
    // run scene actions
    sceneActions[scene]();
  }, [scene]);

  // resolve selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;
    const cardsMatch = first?.image === second?.image;

    if (!bothCardsSelected) {
      return;
    }

    if (cardsMatch) {
      console.log('cards match');
      setScene(scenes.cardsMatch);
    } else {
      console.log('cards dont match');
      setScene(scenes.cardsDontMatch);
    }
  }, [selectedCards]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button className="bg-primary-blue" text={t('utils.new_game')} onClick={() => setScene(scenes.begin)} />
      </div>
      <div className={`grid grid-cols-4 gap-2`}>
        {cards.map((card) => (
          <Card key={card.id} onClick={selectCard} card={card} scene={scene} selected={isSelected(card)} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
