import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { useTranslation, Trans } from 'next-i18next';
import Card from './MemoryGameCard';
import { AudioPlayer } from 'components/utils/AudioPlayer';
import { useLanguage } from 'components/utils/useLanguageHook';

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
  const colors = cardsData.map(() => `hsl(${360 / cardsData.length},50%,50%)`);
  return cardsData.map((item, i) => ({ ...item, color: `hsl(${(360 / cardsData.length) * i},50%,50%)` }));
};

const MemoryGame = ({ cardsData }: MemoryGameProps) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);

  interface SelectedCards {
    first: CardType | null;
    second: CardType | null;
  }

  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ first: null, second: null });

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

  const playSound = (card: CardType) => AudioPlayer.getInstance().playTextToSpeech(card.translation[otherLanguage], otherLanguage);

  const flippCard = (cardToFlip: CardType) =>
    setCards((cards) => cards.map((card) => (card.id === cardToFlip.id ? { ...card, flipped: !card.flipped } : card)));
  // TODO: play flippcard sound...maybe

  const selectCard = (card: CardType) => {
    const { first, second } = selectedCards;
    if (first === null && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, first: card }));
      flippCard(card);
      playSound(card);
    } else if (!second && !card.flipped) {
      setSelectedCards((prev) => ({ ...prev, second: card }));
      flippCard(card);
      playSound(card);
    }
  };

  // game init
  useEffect(() => {
    newGame();
  }, []);

  // resolve selected cards
  useEffect(() => {
    const { first, second } = selectedCards;

    const bothCardsSelected = first !== null && second !== null;
    const cardsMatch = first?.image === second?.image;

    if (!bothCardsSelected) {
      return;
    }

    if (cardsMatch) {
      setSelectedCards({ first: null, second: null });
      console.log('cards match');
      // TODO: play word
      if (cards.every((card) => card.flipped)) {
        console.log('victory');
        // TODO: play victory sound
      }
    } else {
      console.log('cards dont match');
      // TODO: play oh..no sound
      setTimeout(() => {
        flippCard(first);
        flippCard(second);
        setSelectedCards({ first: null, second: null });
      }, 1500);
    }
  }, [selectedCards]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button text={t('utils.new_game')} onClick={newGame} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <Card key={card.id} onClick={selectCard} card={card} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
