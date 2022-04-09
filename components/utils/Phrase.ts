import { Language } from 'data/locales';
import { decodeType, record, string } from 'typescript-json-decoder';

const TranslationJSONDecoder = record({
  cz_translation: string,
  ua_translation: string,
  ua_transcription: string,
  cz_transcription: string,
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
    this.ukTranscription = translation.ua_transcription;
    this.ukTranslation = translation.ua_translation;
    this.otherTranslation = translation.cz_translation;
    this.otherTranscription = translation.cz_transcription;
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
