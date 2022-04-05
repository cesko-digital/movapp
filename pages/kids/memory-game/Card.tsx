import React from 'react';
import Image from 'next/image';

const Card = ({ src }: { src: string }) => {
  return (
    <>
      <div className="w-20 h-20 border-2 border-primary-blue rounded-xl shadow-xl bg-gray-50 relative sm:w-36 sm:h-36">
        <Image src={src} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />      
        {/*<Image src={'/icons/movapp-logo.png'} layout="fill" sizes="100%" objectFit="cover" alt="cz_translation" />*/}
      </div>
    </>
  );
};

export default Card;
