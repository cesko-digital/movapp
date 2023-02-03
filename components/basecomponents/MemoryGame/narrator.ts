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
type Play = () => Promise<void>;
type PlayCategory = (category: Category) => Promise<void>;
export type Narrator = (category: Category, lang: Language) => Promise<void>;
export type NarratorDecorator = (promise: Promise<void>) => Promise<void>;
export interface NarratorInterface {
  currentLanguage: Record<Category, Play>;
  otherLanguage: Record<Category, Play>;
  randomLanguage: Record<Category, Play>;
}

export const extractNarratorPhrases = (dictionary: DictionaryDataObject): Phrase[] => {
  const category = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY);
  if (category === undefined) return [];
  return category.translations;
};

export const createInterface = (
  narratorPhrases: Phrase[],
  getCurrentLang: () => Language,
  getOtherLang: () => Language,
  decorator: NarratorDecorator = (promise) => promise
): NarratorInterface => {
  const narrator = (category: Category, lang: Language) => AudioPlayer.getInstance().playSrc(findSoundUrl(narratorPhrases, category, lang));

  const currentLanguage = (category: Category) => decorator(narrator(category, getCurrentLang()));
  const otherLanguage = (category: Category) => decorator(narrator(category, getOtherLang()));
  const randomLanguage = (category: Category) => (Math.random() < 0.5 ? otherLanguage(category) : currentLanguage(category));

  const createLangInterface = (playFunc: PlayCategory): Record<Category, Play> =>
    Object.entries(Category).reduce((prev, [, val]) => ({ ...prev, [val]: playFunc(val) }), {} as Record<Category, Play>);

  return {
    currentLanguage: createLangInterface(currentLanguage),
    otherLanguage: createLangInterface(otherLanguage),
    randomLanguage: createLangInterface(randomLanguage),
  };
};
