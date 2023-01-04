import { useState, useEffect } from 'react';

const DelayedRender = ({ delay, children }: { delay: number; children: JSX.Element | JSX.Element[] }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{shouldRender && children}</>;
};

export default DelayedRender;
