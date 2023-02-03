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

  const randomId = getRandomItem<string>(NARRATOR_PHRASES_IDS[category]);
  const result = phrases.find((phrase) => phrase.getId() === randomId);
  if (result === undefined) return '';

  return result.getSoundUrl(lang);
};

type GetSoundUrlInCategory = (category: Category) => string;
export type Narrator = (category: Category, lang: Language) => string;

export interface PlayAudio<Type> {
  (soundUrl: string): Type;
}
type NarratorInterfaceItem<Type> = Record<Category, { play: () => Type }>;
export interface NarratorInterface<Type> {
  currentLanguage: NarratorInterfaceItem<Type>;
  otherLanguage: NarratorInterfaceItem<Type>;
  randomLanguage: NarratorInterfaceItem<Type>;
}

export const extractNarratorPhrases = (dictionary: DictionaryDataObject): Phrase[] => {
  const category = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY);
  if (category === undefined) return [];
  return category.translations;
};

const defaultPlayAudio: PlayAudio<string> = (url: string) => url;

export const createInterface = <T = string>(
  narratorPhrases: Phrase[],
  getCurrentLang: () => Language,
  getOtherLang: () => Language,
  playAudio: PlayAudio<T | string> = defaultPlayAudio
): NarratorInterface<T> => {
  const narrator = (category: Category, lang: Language) => findSoundUrl(narratorPhrases, category, lang);

  const currentLanguage = (category: Category) => narrator(category, getCurrentLang());
  const otherLanguage = (category: Category) => narrator(category, getOtherLang());
  const randomLanguage = (category: Category) => (Math.random() < 0.5 ? otherLanguage(category) : currentLanguage(category));

  const createLangInterface = (getSoundUrl: GetSoundUrlInCategory): NarratorInterfaceItem<T> =>
    Object.entries(Category).reduce(
      (prev, [, val]) => ({ ...prev, [val]: { play: () => playAudio(getSoundUrl(val)) } }),
      {} as NarratorInterfaceItem<T>
    );

  return {
    currentLanguage: createLangInterface(currentLanguage),
    otherLanguage: createLangInterface(otherLanguage),
    randomLanguage: createLangInterface(randomLanguage),
  };
};
