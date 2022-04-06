import React from 'react';
import Image from 'next/image';
import { CardType } from './MemoryGame';

const MemoryGameCard = ({ card, onClick }: { card: CardType; onClick: (card: CardType) => void }) => {
  const handleClick = () => onClick(card);
  return (
    <>
      <div
        onClick={handleClick}
        className="w-20 h-20 border-2 border-primary-blue rounded-xl shadow-xl bg-gray-50 relative overflow-hidden sm:w-36 sm:h-36"        
      >
        {/*<Image src={src} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />      
        <Image src={'/icons/movapp-logo.png'} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />*/}
        <img src={card.image} className="w-full absolute select-none" style={{transition: "transform 200ms linear", transitionDelay: card.flipped ? "200ms" : "0ms" , transform: card.flipped ? "rotateY(0deg)" : "rotateY(90deg)"}}/>
        <img src={'/icons/movapp-logo.png'} className="h-full absolute" style={{transition: "transform 200ms linear", transitionDelay: card.flipped ? "0ms" : "200ms" , transform: card.flipped ? "rotateY(90deg)" : "rotateY(0deg)"}}/>
      </div>
    </>
  );
};

export default MemoryGameCard;
