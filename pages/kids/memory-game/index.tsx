import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';
import defaultThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameXmasTheme.module.css';
import getCardsData from '../../../components/basecomponents/MemoryGame/getCardsData';
import styles from '../../../components/basecomponents/MemoryGame/MemoryGameThemeLoader.module.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Theme } from 'components/basecomponents/MemoryGame/MemoryGame';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  ssr: false,
});

const themes: Theme[] = [
  {
    id: 'default',
    image: '/kids/memory-game/card_back_movapp.png',
    audio: {
      cardFlipSound: '/kids/memory-game/card_flip.mp3',
      cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
      winMusic: '/kids/memory-game/win_music_sh.mp3',
    },
    styles: defaultThemeStyles,
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
  },
];

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const phrases = useMemo(() => getKidsCategory(dictionary)?.translations || [], [dictionary]);
  const [currentTheme, setCurrentTheme] = useState(themes[2]);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_memorygame_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_memorygame_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <div className={styles.app}>
          {/* Theme selection */}
          <div className={styles.themeNav}>
            {themes.map((theme) => (
              <div key={theme.id} className={styles.themeButton} onClick={() => setCurrentTheme(theme)}>
                <Image src={theme.image} layout="fill" sizes="33vw" objectFit="cover" alt="card back" priority />
              </div>
            ))}
          </div>
          {/* Main game component */}
          <MemoryGame theme={currentTheme} cardsData={getCardsData(phrases)} />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default MemoryGameSection;
