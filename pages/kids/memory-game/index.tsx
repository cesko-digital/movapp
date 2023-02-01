import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory, getCategories, Phrase } from 'utils/getDataUtils';
import { getServerSideTranslations } from 'utils/localization';
import defaultThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameXmasTheme.module.css';
import getCardsData from 'components/basecomponents/MemoryGame/getCardsData';
import styles from 'components/basecomponents/MemoryGame/MemoryGameThemeLoader.module.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  ssr: false,
});

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
      },
    ];
  }, [dictionary]);

  return themes;
};

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const themes = useThemes(dictionary);
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
                <Image src={theme.image} layout="fill" sizes="100%" objectFit="cover" alt="card back" priority />
              </div>
            ))}
          </div>
          {/* Main game component */}
          <MemoryGame theme={currentTheme} />
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
