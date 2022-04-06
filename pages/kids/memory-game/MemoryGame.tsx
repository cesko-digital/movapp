import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import kidsWords from '../../../data/translations/pro-deti.json';
import { Button } from '../../../components/basecomponents/Button';
import Card from './MemoryGameCard';
import { KidsTranslationsContainer } from '../../../components/basecomponents/KidsTranslationContainer';
import { createReadStream } from 'fs';
export { getStaticProps } from '../../../utils/localization';

const cardsData = [
  { image: '/kids/auticka.svg' },
  { image: '/kids/mic.svg' },
  { image: '/kids/postel.svg' },
  { image: '/kids/zahrada.svg' },
  { image: '/kids/omalovanky.svg' },
  { image: '/kids/panenka.svg' },
  { image: '/kids/vlacky.svg' },
  { image: '/kids/hory.svg' },
];

export interface CardType {
  image: string;
  id: number;
  flipped: boolean;
}

const MemoryGame = () => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);
  const [firstSelectedCard, setFirstSelectedCard] = useState<CardType | null>(null);
  const [secondSelectedCard, setSecondSelectedCard] = useState<CardType | null>(null);

  const newGame = () => {
    // duplicate and shuffle cards
    setCards([...cardsData, ...cardsData].sort(() => Math.random() - 0.5).map((card) => ({ ...card, id: Math.random(), flipped: false })));
    setFirstSelectedCard(null);
    setSecondSelectedCard(null);
  };

  const flippCard = (id: number) => setCards((cards) => cards.map((card) => (card.id === id ? { ...card, flipped: !card.flipped } : card)));

  const selectCard = (card: CardType) => {
    if (!firstSelectedCard && !card.flipped) {
      setFirstSelectedCard(card);
      flippCard(card.id);
    } else if (!secondSelectedCard && !card.flipped) {
      setSecondSelectedCard(card);
      flippCard(card.id);
    }
    console.log(cards);
  };

  useEffect(() => {
    if (firstSelectedCard && secondSelectedCard) {
      if (firstSelectedCard.image === secondSelectedCard.image) {
        setFirstSelectedCard(null);
        setSecondSelectedCard(null);
        console.log('cards match');        
        if (cards.filter(card => !card.flipped).length === 0) {
          console.log("victory")
        }        
      } else {
        console.log('cards dont match');
        setTimeout(()=>{
        flippCard(firstSelectedCard.id);
        flippCard(secondSelectedCard.id);
        setFirstSelectedCard(null);
        setSecondSelectedCard(null);
        },1500);
      }
    }
  }, [secondSelectedCard]);

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button text="New game" onClick={newGame} />
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
