import { Category } from 'utils/getDataUtils';
import { Phrase } from 'utils/getDataUtils';
import { Language } from 'utils/locales';

/** Components Props */
export type KidsCategoryListProps = {
  kidsCategory: Category | undefined;
};

export type KidsTranslationContainerProps = {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  searchText?: string;
};

export type KioskDictionaryCardImageProps = {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  isActive?: boolean;
};

export type KidsTranslationProps = {
  translation: string;
  transcription: string;
  soundUrl: string;
  language: Language;
  isActive?: boolean;
};

/** Stories */
export interface Story {
  title: Record<string, string>;
  slug: string;
  duration: string;
  country: string;
}

/* ENUMS */
export enum Platform {
  KIOSK = 'kiosk',
  WEB = 'web',
}
