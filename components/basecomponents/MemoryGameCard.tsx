import React from 'react';
import { CardType } from './MemoryGame';

const imgCommonClasses =
  'w-full h-full object-cover absolute select-none border-2 border-primary-blue rounded-xl transition-transform duration-300 ease-linear';
  
const MemoryGameCard = ({ card, onClick }: { card: CardType; onClick: (card: CardType) => void }) => {
  const handleClick = () => onClick(card);
  return (
    <>
      <div onClick={handleClick} className="w-20 h-20 relative overflow-hidden sm:w-36 sm:h-36">        
        <img
          src={card.image}
          className={`${imgCommonClasses} bg-gray-50 ${card.flipped ? 'delay-300' : 'delay-0'}`}
          style={{ transform: card.flipped ? 'rotateY(0) scale(1.0001)' : 'rotateY(90deg) scale(1)' , backfaceVisibility: "hidden", imageRendering: "-webkit-optimize-contrast" }}
          alt="front"
        />
        <img
          src={'/kids/card_back_movapp.png'}
          className={`${imgCommonClasses} ${card.flipped ? 'delay-0' : 'delay-300'}`}
          style={{ transform: card.flipped ? 'rotateY(90deg) scale(1.0001)' : 'rotateY(0) scale(1)' , backfaceVisibility: "hidden", imageRendering: "-webkit-optimize-contrast" }}
          alt="back"
        />
      </div>
    </>
  );
};

export default MemoryGameCard;
