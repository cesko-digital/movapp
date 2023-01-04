import React, { useMemo, useState } from 'react';
import { DictionaryDataObject, getKidsCategory, getCategories, Phrase } from 'utils/getDataUtils';
import defaultThemeStyles from './Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from './Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from './Themes/MemoryGameXmasTheme.module.css';
import getCardsData from './getCardsData';
import styles from './MemoryGameApp.module.css';
import Image from './ImageSuspense';
import MemoryGame from './MemoryGame';
import Spinner from 'components/basecomponents/Spinner/Spinner';
import SuspenseKicker from './SuspenseKicker';
import DelayedRender from './DelayedRender';

const useThemes = (dictionary: DictionaryDataObject) => {
  const themes = useMemo(() => {
    const kidsCategoryPhrases = getKidsCategory(dictionary)?.translations || [];
    const kidsCategoryIds = kidsCategoryPhrases.map((phrase) => phrase.getId());

    const filterByCategories = (categoryIds: string[]) =>
      getCategories(dictionary)
        .filter(({ id }) => categoryIds.includes(id))
        .reduce((prev, { translations }) => [...translations, ...prev], [] as Phrase[])
        .filter((phrase) => kidsCategoryIds.includes(phrase.getId())) || [];

    const xmasCategoryIds = ['recWXyM3QhgRpcGDK', 'recFWQE9B5AhreCoh', 'recqnC9snZys7FgzS'];
    const xmasPhrases = filterByCategories(xmasCategoryIds);
    const taleCategoryIds = ['recWXyM3QhgRpcGDK'];
    const talePhrases = filterByCategories(taleCategoryIds);

    return [
      {
        id: 'default',
        image: '/kids/memory-game/card_back_movapp.png',
        audio: {
          cardFlipSound: '/kids/memory-game/card_flip.mp3',
          cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
          winMusic: '/kids/memory-game/win_music_sh.mp3',
        },
        styles: defaultThemeStyles,
        cardsData: getCardsData(kidsCategoryPhrases),
      },
      {
        id: 'tale',
        image: '/kids/memory-game/talecard.png',
        audio: {
          cardFlipSound: '/kids/memory-game/card_flip.mp3',
          cardsMatchSound: '/kids/memory-game/spell.mp3',
          winMusic: '/kids/memory-game/win_music_sh.mp3',
        },
        styles: taleThemeStyles,
        cardsData: getCardsData(talePhrases),
        buttonImage: '/kids/memory-game/talebutton.png',
      },
      {
        id: 'xmas',
        image: '/kids/memory-game/xmascard.png',
        audio: {
          cardFlipSound: '/kids/memory-game/card_flip.mp3',
          cardsMatchSound: '/kids/memory-game/xmasbell.mp3',
          winMusic: '/kids/memory-game/jingle_bells.mp3',
        },
        styles: xmasThemeStyles,
        cardsData: getCardsData(xmasPhrases),
        buttonImage: '/kids/memory-game/xmasbutton.gif',
      },
    ];
  }, [dictionary]);

  return themes;
};

const MemoryGameApp = ({ dictionary }: { dictionary: DictionaryDataObject }) => {
  const themes = useThemes(dictionary);
  const [currentTheme, setCurrentTheme] = useState(themes[2]);

  return (
    <div className={styles.app}>
      <React.Suspense
        fallback={
          <div className={styles.spinnerWrapper}>
            <DelayedRender delay={1500}>
              <Spinner />
            </DelayedRender>
          </div>
        }
      >
        <SuspenseKicker />
        <DelayedRender delay={100}>
          {/* Theme selection */}
          <div className={styles.themeNav}>
            {themes.map((theme) => (
              <div key={theme.id} className={styles.themeButton} onClick={() => setCurrentTheme(theme)}>
                <Image src={theme.image} alt={`${theme.id} theme button`} />
              </div>
            ))}
          </div>
          {/* Main game component */}
          <MemoryGame theme={currentTheme} />
        </DelayedRender>        
      </React.Suspense>
    </div>
  );
};

export default MemoryGameApp;
