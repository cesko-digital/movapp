import { Phrase, TranslationJSON, isValidTranslationJSON } from 'utils/Phrase';

// These utils must be in a separate file to avoid cyclical dependencies

export interface Category {
  nameMain: string;
  nameUk: string;
  translations: Phrase[];
}

export const processTranslations = (translations: TranslationJSON[]) => {
  return translations.filter(isValidTranslationJSON).map((translation) => new Phrase(translation));
};
