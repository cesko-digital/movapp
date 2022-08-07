import { getCountryVariant, Language } from 'utils/locales';

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
}

const KIDS_CATEGORY_ID = 'recSHyEn6N0hAqUBp';

const parseCategory = (categoryObject: CategoryDataObject, dictionaryObject: DictionaryDataObject): Category => {
  return {
    nameMain: categoryObject.name.main,
    nameUk: categoryObject.name.source,
    translations: categoryObject.phrases
      .map((phraseId) => dictionaryObject.phrases[phraseId])
      // Some phrases might be missing for some language variants
      .filter(Boolean)
      .map((phrase) => new Phrase(phrase)),
  };
};

export const getCategories = (dictionaryObject: DictionaryDataObject): Category[] => {
  const categoriesToExclude = [KIDS_CATEGORY_ID];

  return dictionaryObject.categories
    .filter((category) => categoriesToExclude.includes(category.id) === false)
    .map((category) => parseCategory(category, dictionaryObject));
};

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

export const fetchDictionary = async () => {
  const result = await (await fetch(`https://data.movapp.eu/uk-${getCountryVariant()}-dictionary.json`)).json();
  return result as DictionaryDataObject;
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

