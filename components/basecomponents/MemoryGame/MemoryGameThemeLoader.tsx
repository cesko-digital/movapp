// @ts-nocheck
import React, { useMemo, useState } from 'react';
import MemoryGameLoading from 'components/basecomponents/MemoryGame/MemoryGameLoading';
import styles from './MemoryGameThemeLoader.module.css';
import Image from 'next/image';
import { Phrase } from 'utils/getDataUtils';
import getCardsData from './getCardsData';
import { CardData } from './MemoryGame';

const DefaultTheme = React.lazy(() => import('./Themes/MemoryGameDefaultTheme'));
const TaleTheme = React.lazy(() => import('./Themes/MemoryGameTaleTheme'));
const XmasTheme = React.lazy(() => import('./Themes/MemoryGameXmasTheme'));

type Theme = {
  id: string;
  image: string;
  component: React.LazyExoticComponent<(props: { cardsData: CardData[] }) => JSX.Element>;
};

const themes: Theme[] = [
  {
    id: 'default',
    image: '/kids/memory-game/card_back_movapp.png',
    component: DefaultTheme,
  },
  {
    id: 'tale',
    image: '/kids/memory-game/talecard.png',
    component: TaleTheme,
  },
  {
    id: 'xmas',
    image: '/kids/memory-game/xmascard.png',
    component: XmasTheme,
  },
];

const ThemeButton = ({ image, onClick }: { image: string; onClick: () => void }) => (
  <div className={styles.themeButton} onClick={onClick}>
    <Image src={image} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
  </div>
);

const MemoryGameThemeLoader = ({ phrases }: { phrases: Phrase[] }) => {
  const [currentTheme, setCurrentTheme] = useState(themes[2]);
  const cardsData = useMemo(() => getCardsData(phrases), [phrases]);

  return (
    <React.Suspense fallback={<MemoryGameLoading />}>
      <div className={styles.app}>
        <div className={styles.themeNav}>
          {themes.map((theme) => (
            <ThemeButton key={theme.id} image={theme.image} onClick={() => setCurrentTheme(theme)} />
          ))}
        </div>
        {React.createElement(currentTheme.component, { cardsData })}
      </div>
    </React.Suspense>
  );
};

export default MemoryGameThemeLoader;
