import React, { useState } from 'react';
import MemoryGameLoading from 'components/basecomponents/MemoryGame/MemoryGameLoading';
import styles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';

const DefaultTheme = React.lazy(() => import('./Themes/MemoryGameDefaultTheme'));
const TaleTheme = React.lazy(() => import('./Themes/MemoryGameTaleTheme'));

export enum Theme {
  default = 'default',
  tale = 'tale',
}

const themeImages = {
  [Theme.default]: '/kids/memory-game/card_back_movapp.png',
  [Theme.tale]: '/kids/memory-game/talecard.png',
};

const ThemeButton = ({ image, onClick }: { image: string; onClick: () => void }) => (
  <div className={styles.themeButton} onClick={onClick}>
    <Image src={image} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
  </div>
);

const MemoryGameThemeLoader = (props: { theme: Theme }) => {
  const [theme, setTheme] = useState(props.theme);

  return (
    <React.Suspense fallback={<MemoryGameLoading />}>
      <div className={styles.app}>
        <div className={styles.themeNav}>
          {Object.entries(themeImages).map(([theme, image]) => (
            <ThemeButton key={Math.random()} image={image} onClick={() => setTheme(theme as Theme)} />
          ))}
        </div>

        {theme === Theme.default && <DefaultTheme />}
        {theme === Theme.tale && <TaleTheme />}
      </div>
    </React.Suspense>
  );
};

export default MemoryGameThemeLoader;
