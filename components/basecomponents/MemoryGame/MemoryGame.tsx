import React, { useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { useTranslation, Trans } from 'next-i18next';
import Card from './MemoryGameCard';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import phrases from './MemoryGamePhrases.json';

function getRandomElement<Type>(arr: Type[]): Type {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
  none: 'none',
  game: 'game',
  begin: 'begin',
  cardsMatch: 'cardsMatch',
  cardsMatchReward: 'cardsMatchReward',
  cardsDontMatch: 'cardsDontMatch',
  cardsDontMatchReward: 'cardsDontMatchReward',
  victory: 'victory',
});

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

  const [scene, setScene] = useState<string>(scenes.none);
  const [controlsEnabled, setControlsEnabled] = useState<boolean>(false);

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

  const flippCard = (cardToFlip: CardType) =>
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  // TODO: play flippcard sound...maybe

  const selectCard = (card: CardType) => {
    if (!controlsEnabled) return;

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
      none: () => {
        // initial state
        // begin new game automaticaly
        setScene(scenes.begin);
      },
      begin: () => {
        // new game
        newGame();
        // disable controls
        setControlsEnabled(false);
        // play css animations and sounds, play phrase
        playPhrase(getRandomElement(phrases.newGame));
        // setTimeout: set scene game
        setTimeout(() => {
          setScene(scenes.game);
        }, 1500);
      },
      game: () => {
        // enable controls
        setControlsEnabled(true);
      },
      cardsMatch: () => {
        // disable controls
        setControlsEnabled(false);
        // play css animations and sounds
        setTimeout(() => {
          setScene(scenes.cardsMatchReward);
        }, 1000);
      },
      cardsMatchReward: () => {
        // play css animations and sounds
        Math.random() > 0.5 && playPhrase(getRandomElement(phrases.good));
        // reset selected cards
        setSelectedCards({ first: null, second: null });
        // check victory
        // setTimeout: set scene game or victory
        setTimeout(() => {
          if (cards.every((card) => card.flipped)) {
            console.log('victory');
            setScene(scenes.victory);
          } else {
            setScene(scenes.game);
          }
        }, 1500);
      },
      cardsDontMatch: () => {
        // disable controls
        setControlsEnabled(false);
        // play css animations and sounds

        // setTimeout: show cards for a period of time
        setTimeout(() => {
          setScene(scenes.cardsDontMatchReward);
        }, 1200);
      },
      cardsDontMatchReward: () => {
        // play animations and sounds
        Math.random() > 0.8 && playPhrase(getRandomElement(phrases.wrong));
        // setTimeout: set scene game
        setTimeout(() => {
          const { first, second } = selectedCards;
          flippCard(first!);
          flippCard(second!);
          setSelectedCards({ first: null, second: null });
          setScene(scenes.game);
        }, 1000);
      },
      victory: () => {
        // disable controls
        setControlsEnabled(false);
        // play css animations and sounds
        playPhrase(getRandomElement(phrases.good));
      },
    };
    console.log(`scene is: ${scene}`);
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
