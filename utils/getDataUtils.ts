import { getCountryVariant, Language, CountryVariant } from 'utils/locales';
import fetch from 'node-fetch';

const BASE_API_URL = process.env.BASE_API_URL || 'https://data.movapp.eu';
const KIDS_CATEGORY_ID = 'recSHyEn6N0hAqUBp';

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
    return language === 'uk' ? this.phraseData.source.translation : this.phraseData.main.translation;
  };

  getTranscription = (language?: Language) => {
    return language === 'uk' ? this.phraseData.source.transcription : this.phraseData.main.transcription;
  };

  getSoundUrl = (language?: Language) => {
    return language === 'uk' ? this.phraseData.source.sound_url : this.phraseData.main.sound_url;
  };

  getImageUrl = (): string | null => this.phraseData.image_url;
  getId = () => this.phraseData.id;
}

const mapPhraseObjectsToPhrases = (phraseObjects: PhraseDataObject[]): Phrase[] => {
  return phraseObjects.map((phraseObject) => new Phrase(phraseObject));
};

export const parseCategory = ({ id, name, phrases }: CategoryDataObject, dictionaryObject: DictionaryDataObject): Category => {
  return {
    id,
    nameMain: name.main,
    nameUk: name.source,
    translations: mapPhraseObjectsToPhrases(phrases.map((phraseId) => dictionaryObject.phrases[phraseId]).filter(Boolean)),
  };
};

export const getCategories = (dictionaryObject: DictionaryDataObject): Category[] =>
  dictionaryObject.categories.map((category) => parseCategory(category, dictionaryObject));

export const getAllPhrases = (dictionaryObject: DictionaryDataObject): Phrase[] => {
  return mapPhraseObjectsToPhrases([...Object.values(dictionaryObject.phrases)]);
};

export const getKidsCategory = (dictionaryObject: DictionaryDataObject): Category | undefined => {
  const categoryObject = dictionaryObject.categories.find((category) => category.id === KIDS_CATEGORY_ID);
  return categoryObject ? parseCategory(categoryObject, dictionaryObject) : undefined;
};

export const getPhraseById = (dictionaryObject: DictionaryDataObject, phraseId: string): Phrase => {
  return new Phrase(dictionaryObject.phrases[phraseId]);
};

export const fetchRawDictionary = async (country?: CountryVariant): Promise<DictionaryDataObject> => {
  const response = await fetch(`${BASE_API_URL}/uk-${country ?? getCountryVariant()}-dictionary.json`);
  return (await response.json()) as DictionaryDataObject;
};

export const fetchDictionary = async (country?: CountryVariant): Promise<DictionaryDataObject> => {
  const json = await fetchRawDictionary(country);
  return { ...json, categories: json.categories.filter((category) => !category.hidden) };
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

export const fetchAlphabetUk = async (): Promise<AlphabetDataObject> => {
  const response = await fetch(`${BASE_API_URL}/uk-${getCountryVariant()}-alphabet.json`);
  return await response.json();
};

export const fetchAlphabetMain = async (): Promise<AlphabetDataObject> => {
  const response = await fetch(`${BASE_API_URL}/${getCountryVariant()}-uk-alphabet.json`);
  return (await response.json()) as AlphabetDataObject;
};
