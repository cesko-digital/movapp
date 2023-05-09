import { CountryVariant } from './locales';
import { getCountryVariant, Language } from '../utils/locales';
import fetch from 'node-fetch';

/**
 * Dictionary
 * */

export interface DictionaryDataObject {
  source: Language;
  main: Language;
  categories: CategoryDataObject[];
  phrases: Record<string, PhraseDataObject>;
}

export interface CategoryDataObject {
  id: string;
  name: {
    // uk
    source: string;
    // cz, sk, pl
    main: string;
  };
  description: string;
  phrases: string[];
  hidden?: boolean;
  metaOnly?: boolean;
  metacategories: string[];
}

export interface PhraseDataObject {
  id: string;
  main: TranslationDataObject;
  source: TranslationDataObject;
  image_url: null | string;
}

export interface TranslationDataObject {
  sound_url: string;
  translation: string;
  transcription: string;
}

export interface Category {
  id: string;
  nameMain: string;
  nameUk: string;
  translations: Phrase[];
}

export class Phrase {
  private phraseData: PhraseDataObject;

  constructor(phraseObject: PhraseDataObject) {
    this.phraseData = phraseObject;
  }

  getTranslation = (language?: Language) => {
    if (language === 'uk') {
      return this.phraseData.source.translation;
    } else {
      return this.phraseData.main.translation;
    }
  };

  getTranscription = (language?: Language) => {
    if (language === 'uk') {
      return this.phraseData.source.transcription;
    } else {
      return this.phraseData.main.transcription;
    }
  };

  getSoundUrl = (language?: Language) => {
    if (language === 'uk') {
      return this.phraseData.source.sound_url;
    } else {
      return this.phraseData.main.sound_url;
    }
  };

  getImageUrl = () => this.phraseData.image_url;
  getId = () => this.phraseData.id;
}

const KIDS_CATEGORY_ID = 'recSHyEn6N0hAqUBp';

export const parseCategory = (categoryObject: CategoryDataObject, dictionaryObject: DictionaryDataObject): Category => {
  return {
    id: categoryObject.id,
    nameMain: categoryObject.name.main,
    nameUk: categoryObject.name.source,
    translations: categoryObject.phrases
      .map((phraseId) => dictionaryObject.phrases[phraseId])
      // Some phrases might be missing for some language variants
      .filter(Boolean)
      .map((phrase) => new Phrase(phrase)),
  };
};

export const getCategories = (dictionaryObject: DictionaryDataObject): Category[] =>
  dictionaryObject.categories.map((category) => parseCategory(category, dictionaryObject));

export const getAllPhrases = (dictionaryObject: DictionaryDataObject): Phrase[] => {
  return [...Object.values(dictionaryObject.phrases)].map((phraseObject) => new Phrase(phraseObject));
};

export const getKidsCategory = (dictionaryObject: DictionaryDataObject): Category | undefined => {
  const categoryObject = dictionaryObject.categories.find((category) => category.id === KIDS_CATEGORY_ID);
  if (!categoryObject) {
    return undefined;
  } else {
    return parseCategory(categoryObject, dictionaryObject);
  }
};

export const getPhraseById = (dictionaryObject: DictionaryDataObject, phraseId: string): Phrase => {
  return new Phrase(dictionaryObject.phrases[phraseId]);
};

export const fetchRawDictionary = async (country?: CountryVariant): Promise<DictionaryDataObject> => {
  const response = await fetch(`https://data.movapp.eu/uk-${country ?? getCountryVariant()}-dictionary.json`);
  const json = (await response.json()) as DictionaryDataObject;
  return json;
};

export const fetchDictionary = async (country?: CountryVariant): Promise<DictionaryDataObject> => {
  const json = await fetchRawDictionary(country);
  // filter out categories with hidden set to true, or if there's no hidden attribute, filter out categories with metaOnly set to true
  const result = {
    ...json,
    categories: json.categories.filter(
      (category) => !(category.hidden === true || (category.hidden === undefined && category.metaOnly === true))
    ),
  };
  return result;
};

/**
 * Alphabet
 * */

export interface Letter {
  id: string;
  letters: [string, string | null];
  examples: TranslationDataObject[];
  sound_url: string | null;
  transcription: string;
}

export interface AlphabetDataObject {
  // uk
  source: Language;
  // cs, sk, pl
  main: Language;
  data: Letter[];
}

export const fetchAlphabetUk = async () => {
  const result = await (await fetch(`https://data.movapp.eu/uk-${getCountryVariant()}-alphabet.json`)).json();
  return result as AlphabetDataObject;
};

export const fetchAlphabetMain = async () => {
  const result = await (await fetch(`https://data.movapp.eu/${getCountryVariant()}-uk-alphabet.json`)).json();
  return result as AlphabetDataObject;
};
