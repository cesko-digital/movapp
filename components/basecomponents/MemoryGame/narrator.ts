import { AudioPlayer } from 'utils/AudioPlayer';
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

//export type Narrator = (category: Category, lang: Language) => Promise<void>;

export interface Narrator {
  currentLanguage: (category: Category) => Promise<void>;
  otherLanguage: (category: Category) => Promise<void>;
  randomLanguage: (category: Category) => Promise<void>;
}

// export const createNarratorFunc = (dictionary: DictionaryDataObject) => {
//   const narratorPhrases = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY)?.translations;

//   const play = (category: Category, lang: Language) => AudioPlayer.getInstance().playSrc(findSoundUrl(narratorPhrases, category, lang));

//   return play;
// };

// export const createNarratorInterface = (getNarrator: () => Narrator, getCurrentLang: () => Language, getOtherLang: () => Language) => {
//   const currentLanguage = (category: Category) => getNarrator()(category, getCurrentLang());
//   const otherLanguage = (category: Category) => getNarrator()(category, getOtherLang());
//   const randomLanguage = (category: Category) => (Math.random() < 0.5 ? otherLanguage(category) : currentLanguage(category));

//   return {
//     currentLanguage,
//     otherLanguage,
//     randomLanguage,
//   };
// };

export const createNarrator = (dictionary: DictionaryDataObject, getCurrentLang: () => Language, getOtherLang: () => Language) => {
  const narratorPhrases = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY)?.translations;

  const play = (category: Category, lang: Language) => AudioPlayer.getInstance().playSrc(findSoundUrl(narratorPhrases, category, lang));

  const currentLanguage = (category: Category) => play(category, getCurrentLang());
  const otherLanguage = (category: Category) => play(category, getOtherLang());
  const randomLanguage = (category: Category) => (Math.random() < 0.5 ? otherLanguage(category) : currentLanguage(category));

  return {
    currentLanguage,
    otherLanguage,
    randomLanguage,
  };
};
