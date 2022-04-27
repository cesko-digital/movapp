import { Language } from 'utils/locales';
import { decodeType, record, string } from 'typescript-json-decoder';
import { translitToUkrainian, translitFromUkrainian } from './transliterate';

const TranslationJSONDecoder = record({
  uk: string,
  main: string,
});
export type TranslationJSON = decodeType<typeof TranslationJSONDecoder>;

export const isValidTranslationJSON = (input: TranslationJSON): input is TranslationJSON => {
  try {
    TranslationJSONDecoder(input);
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

export class Phrase {
  ukTranslation: string;
  ukTranscription: string;
  otherTranslation: string;
  otherTranscription: string;

  constructor(translation: TranslationJSON) {
    // To do later: generate transcription automatically here
    this.ukTranslation = translation.uk;
    this.ukTranscription = translitFromUkrainian(translation.uk);
    this.otherTranslation = translation.main;
    this.otherTranscription = translitToUkrainian(translation.main);
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
}
