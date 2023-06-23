import { useState, useEffect } from 'react';

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};

export default useWindowSize;
