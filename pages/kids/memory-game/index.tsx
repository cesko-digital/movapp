import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionaryForGame, getKidsCategory, getCategories, Phrase, PhraseDataObject } from 'utils/getDataUtils';
import { getServerSideTranslations } from 'utils/localization';
import defaultThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameXmasTheme.module.css';
import MemoryGame from 'components/basecomponents/MemoryGame/MemoryGame';

const NARRATOR_PHRASE_IDS = {
  good: ['recQNGsOmqZZqfaWk', 'recyVofgBLyNQuzwb', 'recy7qKMbsuME37jh', 'recpmWDOj6I4CDEBM', 'rec4VuOdYDuJKGumf'],
  wrong: ['reclGajD1aVNAYpnJ', 'recTs2905OPays42Z', 'rec9Zrh723Pikrh1F'],
  newGame: ['recjnm1SPnUJFVJCw', 'recC4L2fmipjcDF6i'],
  win: ['recnQaCaCF8Bsob0g', 'recwFVrr9aDARuxOk', 'rec3Xdb5QAjNFr7ob', 'recmYthRZ57qOfBVU'],
};

const getNarratorPhrases = (dictionary: DictionaryDataObject) => {
  const NARRATOR_PHRASES_CATEGORY = 'rec4bnE1FDvucna8y';
  const phrases = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY)?.translations ?? [];
  const findPhrase = (searchId: PhraseDataObject['id']) => phrases.find((phrase) => phrase.getId() === searchId);

  return Object.entries(NARRATOR_PHRASE_IDS).reduce((acc, [key, value]) => ({ ...acc, [key]: value.map(findPhrase) }), {});
};

// REFACTOR TO FUNCTION

const useThemes = (dictionary: DictionaryDataObject) => {
  const themes = useMemo(() => {
    const kidsCategoryPhrases = getKidsCategory(dictionary)?.translations || [];
    const kidsCategoryIds = kidsCategoryPhrases.map((phrase) => phrase.getId());

    const filterByCategories = (categoryIds: string[]) =>
      getCategories(dictionary)
        .filter(({ id }) => categoryIds.includes(id))
        .reduce((prev, { translations }) => [...translations, ...prev], [] as Phrase[])
        .filter((phrase) => kidsCategoryIds.includes(phrase.getId())) || [];

    const filterNoImagePhrases = (phrases: Phrase[]) => phrases.filter((phrase) => phrase.getImageUrl !== null);

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
        phrases: filterNoImagePhrases(kidsCategoryPhrases),
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
        phrases: filterNoImagePhrases(talePhrases),
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
        phrases: filterNoImagePhrases(xmasPhrases),
      },
    ];
  }, [dictionary]);

  return themes;
};

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const themes = useThemes(dictionary);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_memorygame_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_memorygame_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <MemoryGame themes={themes} narratorPhrases={getNarratorPhrases(dictionary)} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionaryForGame();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default MemoryGameSection;
