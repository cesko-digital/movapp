import { useState, useEffect } from "react";

const DelayedRender = ({ delay, children }: { delay: number; children: JSX.Element | JSX.Element[] }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay);
    console.log('delayed render set');
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <>{shouldRender && children}</>;
};

export default DelayedRender;