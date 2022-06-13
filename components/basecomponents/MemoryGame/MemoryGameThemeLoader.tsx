import React, { useState } from 'react';
import MemoryGameLoading from 'components/basecomponents/MemoryGame/MemoryGameLoading';
import styles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';

const DefaultTheme = React.lazy(() => import('./Themes/MemoryGameDefaultTheme'));
const TaleTheme = React.lazy(() => import('./Themes/MemoryGameTaleTheme'));

type Theme = {
  id: string;
  image: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}

const themes: Theme[] = [
  {
    id: "default",
    image: '/kids/memory-game/card_back_movapp.png',
    component: DefaultTheme,
  },
  {
    id: "tale",
    image: '/kids/memory-game/talecard.png',
    component: TaleTheme,
  },
]

const ThemeButton = ({ image, onClick }: { image: string; onClick: () => void }) => (
  <div className={styles.themeButton} onClick={onClick}>
    <Image src={image} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
  </div>
);

const MemoryGameThemeLoader = (props: { theme: string }) => {
  const [theme, setTheme] = useState(props.theme);

  return (
    <React.Suspense fallback={<MemoryGameLoading />}>
      <div className={styles.app}>
        <div className={styles.themeNav}>
          {themes.map(({id, image}) => (
            <ThemeButton key={id} image={image} onClick={() => setTheme(id)} />
          ))}
        </div>
        {theme === "default" && <DefaultTheme />}
        {theme === "tale" && <TaleTheme />}
      </div>
    </React.Suspense>
  );
};

export default MemoryGameThemeLoader;
