import { useMemo } from 'react';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { DictionaryDataObject, getCategories, Phrase } from 'utils/getDataUtils';
import getRandomItem from './getRandomItem';
import { Language } from 'utils/locales';

export enum Category {
  good = 'good',
  wrong = 'wrong',
  newGame = 'newGame',
  win = 'win',
}

const NARRATOR_PHRASES_IDS: Record<Category, string[]> = {
  good: ['recQNGsOmqZZqfaWk', 'recyVofgBLyNQuzwb', 'recy7qKMbsuME37jh', 'recpmWDOj6I4CDEBM', 'rec4VuOdYDuJKGumf'],
  wrong: ['reclGajD1aVNAYpnJ', 'recTs2905OPays42Z', 'rec9Zrh723Pikrh1F'],
  newGame: ['recjnm1SPnUJFVJCw', 'recC4L2fmipjcDF6i'],
  win: ['recnQaCaCF8Bsob0g', 'recwFVrr9aDARuxOk', 'rec3Xdb5QAjNFr7ob', 'recmYthRZ57qOfBVU'],
};

const NARRATOR_PHRASES_CATEGORY = 'rec4bnE1FDvucna8y';

const findSoundUrl = (phrases: Phrase[] | undefined, category: Category, lang: Language) => {
  if (phrases === undefined) return '';

  const randomId = getRandomItem(NARRATOR_PHRASES_IDS[category]);
  const result = phrases.find((phrase) => phrase.getId() === randomId);
  if (result === undefined) return '';

  return result.getSoundUrl(lang);
};

export interface Narrator {
  currentLanguage: (category: Category) => Promise<void>;
  otherLanguage: (category: Category) => Promise<void>;
  randomLanguage: (category: Category) => Promise<void>;
}

const useNarrator = (dictionary: DictionaryDataObject) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const narratorPhrases = useMemo(
    () => getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY)?.translations,
    [dictionary]
  );

  const playPhraseCurrentLang = (category: Category) =>
    AudioPlayer.getInstance().playSrc(findSoundUrl(narratorPhrases, category, currentLanguage));

  const playPhraseOtherLang = (category: Category) =>
    AudioPlayer.getInstance().playSrc(findSoundUrl(narratorPhrases, category, otherLanguage));

  const playPhraseRandomLang = (category: Category) =>
    Math.random() < 0.5 ? playPhraseOtherLang(category) : playPhraseCurrentLang(category);

  return {
    currentLanguage: playPhraseCurrentLang,
    otherLanguage: playPhraseOtherLang,
    randomLanguage: playPhraseRandomLang,
  };
};

export default useNarrator;
