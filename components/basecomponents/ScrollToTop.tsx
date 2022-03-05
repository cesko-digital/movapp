import React from 'react';
import ChevronUp from '../../public/icons/chevron-up.svg';

export const ScrollToTop = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div onClick={handleScrollTop} className="fixed bottom-6 right-6 cursor-pointer shadow-around p-2 rounded-md">
      <ChevronUp />
    </div>
  );
};
