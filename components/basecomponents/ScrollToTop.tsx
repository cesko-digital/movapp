import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import ChevronUp from 'public/icons/chevron-up.svg';
import { useCallback, useState } from 'react';

export const ScrollToTop = () => {
  const handleScrollTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const [hideButton, setHideButton] = useState(true);

  useScrollPosition(({ currPos }) => {
    if (currPos.y < 0) {
      setHideButton(false);
    } else {
      setHideButton(true);
    }
  });

  return (
    <button
      onClick={handleScrollTop}
      className={`fixed bg-white bottom-6 right-6 cursor-pointer shadow-around p-2 rounded-md duration-300 ${hideButton && ' scale-0'}`}
    >
      <ChevronUp />
    </button>
  );
};
