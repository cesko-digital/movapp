import React from 'react';

export const useClickOutside = <TElement extends HTMLElement = HTMLElement>(closeHandler: () => void) => {
  const ref = React.useRef<TElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        closeHandler();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeHandler]);

  return { ref };
};
