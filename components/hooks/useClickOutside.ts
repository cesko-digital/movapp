import React from 'react';

export const useClickOutside = <TElement extends HTMLElement = HTMLElement>(closeHandler: () => void) => {
  const ref = React.useRef<TElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      closeHandler();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { ref };
};
