import defaultThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameDefaultTheme.module.css';
import taleThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameTaleTheme.module.css';
import xmasThemeStyles from 'components/basecomponents/MemoryGame/Themes/MemoryGameXmasTheme.module.css';
import { DictionaryDataObject, Phrase, getKidsCategory, getCategories } from 'utils/getDataUtils';

const getThemes = (dictionary: DictionaryDataObject) => {
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
  ];
};

export default getThemes;
