import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';
import defaultThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from '../../../components/basecomponents/MemoryGame/Themes/MemoryGameXmasTheme.module.css';
import getCardsData from '../../../components/basecomponents/MemoryGame/getCardsData';
import dynamic from 'next/dynamic';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  ssr: false,
});

export const defaultTheme = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/reward_sfx.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles: defaultThemeStyles,
  cardBackImage: '/kids/memory-game/card_back_movapp.png',
};

export const taleTheme = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/spell.mp3',
    winMusic: '/kids/memory-game/win_music_sh.mp3',
  },
  styles: taleThemeStyles,
  cardBackImage: '/kids/memory-game/talecard.png',
};

export const xmasTheme = {
  audio: {
    cardFlipSound: '/kids/memory-game/card_flip.mp3',
    cardsMatchSound: '/kids/memory-game/xmasbell.mp3',
    winMusic: '/kids/memory-game/jingle_bells.mp3',
  },
  styles: xmasThemeStyles,
  cardBackImage: '/kids/memory-game/xmascard.png',
};

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const phrases = useMemo(() => getKidsCategory(dictionary)?.translations || [], [dictionary]);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_memorygame_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_memorygame_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <MemoryGame {...xmasTheme} cardsData={getCardsData(phrases)} />
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
