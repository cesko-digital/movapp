import React from 'react';
import Image from 'next/image';
import { CardType } from './MemoryGame';

const imgCommonClasses =
  'w-full h-full absolute object-cover select-none border-2 border-primary-blue rounded-xl shadow-xl transition-transform ease-linear';

const MemoryGameCard = ({ card, onClick }: { card: CardType; onClick: (card: CardType) => void }) => {
  const handleClick = () => onClick(card);
  return (
    <>
      <div onClick={handleClick} className="w-20 h-20 relative overflow-hidden sm:w-36 sm:h-36">
        {/*<Image src={src} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />      
        <Image src={'/icons/movapp-logo.png'} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />*/}
        <img
          src={card.image}
          className={`${imgCommonClasses} bg-gray-50 ${card.flipped ? 'delay-200' : 'delay-0'}`}
          style={{ transform: card.flipped ? 'rotateY(0deg)' : 'rotateY(90deg)' }}
          alt="front"
        />
        <img
          src={'/icons/ua.svg'}
          className={`${imgCommonClasses} bg-primary-blue ${card.flipped ? 'delay-0' : 'delay-200'}`}
          style={{ transform: card.flipped ? 'rotateY(90deg)' : 'rotateY(0deg)' }}
          alt="back"
        />
      </div>
    </>
  );
};

export default MemoryGameCard;
