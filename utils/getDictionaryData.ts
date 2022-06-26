import { Language } from 'utils/locales';

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

export interface Category2 {
  nameMain: string;
  nameUk: string;
  translations: Phrase2[];
}

export class Phrase2 {
  ukTranslation: string;
  ukTranscription: string;
  ukSoundUrl: string;
  otherTranslation: string;
  otherTranscription: string;
  otherSoundUrl: string;

  constructor(phraseObject: PhraseDataObject) {
    // To do later: generate transcription automatically here
    this.ukTranslation = phraseObject.source.translation;
    this.ukTranscription = phraseObject.source.transcription;
    this.ukSoundUrl = phraseObject.source.sound_url;
    this.otherTranslation = phraseObject.main.translation;
    this.otherTranscription = phraseObject.main.transcription;
    this.otherSoundUrl = phraseObject.main.sound_url;
  }

  getTranslation = (language: Language) => {
    if (language === 'uk') {
      return this.ukTranslation;
    } else {
      return this.otherTranslation;
    }
  };

  getTranscription = (language: Language) => {
    if (language === 'uk') {
      return this.ukTranscription;
    } else {
      return this.otherTranscription;
    }
  };

  getSoundUrl = (language: Language) => {
    if (language === 'uk') {
      return this.ukSoundUrl;
    } else {
      return this.otherSoundUrl;
    }
  };
}

export const getCategories = (dictionaryObject: DictionaryDataObject): Category2[] => {
  return dictionaryObject.categories.map((categoryObject) => {
    return {
      nameMain: categoryObject.name.main,
      nameUk: categoryObject.name.source,
      translations: categoryObject.phrases
        .map((phraseId) => {
          return new Phrase2(dictionaryObject.phrases[phraseId]);
        })
        .filter(Boolean),
    };
  });
};

export const getAllPhrases = (dictionaryObject: DictionaryDataObject): Phrase2[] => {
  return [...Object.values(dictionaryObject.phrases)].map((phraseObject) => new Phrase2(phraseObject));
};
