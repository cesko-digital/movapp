import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { useState } from 'react';
import kidsWords from '../../../data/translations/pro-deti.json';
import { Button } from '../../../components/basecomponents/Button';
import Card from './Card';
import { KidsTranslationsContainer } from '../../../components/basecomponents/KidsTranslationContainer';
import { createReadStream } from 'fs';
export { getStaticProps } from '../../../utils/localization';

const images = [
  { src: '/kids/auticka.svg' },
  { src: '/kids/mic.svg' },
  { src: '/kids/postel.svg' },
  { src: '/kids/zahrada.svg' },
  { src: '/kids/omalovanky.svg' },
  { src: '/kids/panenka.svg' },
  { src: '/kids/vlacky.svg' },
  { src: '/kids/hory.svg' },
];

interface CardType {
  src: string;
  id: number;
}

const MemoryGame = () => {
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  const [cards, setCards] = useState<CardType[]>([]);

  const newGame = () => {
    // duplicate and shuffle cards    
    setCards([...images,...images].sort(() => Math.random() - 0.5).map(card => ({...card, id: Math.random()})))
  };

  return (
    <div className="flex flex-col items-center">
      <div className="py-5">
        <Button text="New game" onClick={newGame} />
      </div>
      <div className="grid grid-cols-4 gap-2">        
        {cards.map((card) => (
          <Card key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
