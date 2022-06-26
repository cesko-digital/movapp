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
