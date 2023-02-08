/**
 * Narrator
 * concerns:
 * 1. Map narrator phrases from dictionary
 * 2. Offers method to get phrase of certain category
 *
 * Usage:
 * const narrator = createNarrator(dictionary, () => currentLanguage, () => otherLanguage, playAudio)
 * getPhrase(Category.good).playCurrentLanguage()
 *
 * NarratorPhrase
 * extends Phrase
 * concerns:
 * 1. Extension offers methods to play Phrase soundUrl in current and other language
 * 2. Consumer must provide playAudio function to play sound from url
 *
 * Notes:
 * function to play random language was removed, solve it on upper level
 * eg. create function that takes two functions and executes randomly one of them
 * random(narrator.getPhrase(Category.good).playCurrentLanguage, narrator.getPhrase(Category.good).playOtherLanguage)
 *
 */

import { DictionaryDataObject, Phrase, PhraseDataObject } from 'utils/getDataUtils';
import getRandomItem from './getRandomItem';
import { Language } from 'utils/locales';

export class NarratorPhrase<T> extends Phrase {
  private playAudio: PlayAudio<T>;
  private getCurrentLanguage: () => Language;
  private getOtherLanguage: () => Language;

  constructor(
    phraseObject: PhraseDataObject,
    playAudioFn: PlayAudio<T>,
    getCurrentLanguageFn: () => Language,
    getOtherLanguageFn: () => Language
  ) {
    super(phraseObject);
    this.playAudio = playAudioFn;
    this.getCurrentLanguage = getCurrentLanguageFn;
    this.getOtherLanguage = getOtherLanguageFn;
  }

  playCurrentLanguage = () => this.playAudio(this.getSoundUrl(this.getCurrentLanguage()));
  playOtherLanguage = () => this.playAudio(this.getSoundUrl(this.getOtherLanguage()));
  getTranslationCurrentLanguage = () => this.getTranslation(this.getCurrentLanguage());
  getTranslationOtherLanguage = () => this.getTranslation(this.getOtherLanguage());
  getTranscriptionCurrentLanguage = () => this.getTranscription(this.getCurrentLanguage());
  getTranscriptionOtherLanguage = () => this.getTranscription(this.getOtherLanguage());
}

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

export interface PlayAudio<Type> {
  (soundUrl: string): Type;
}

export const createNarrator = <T>(
  dictionary: DictionaryDataObject,
  getCurrentLang: () => Language,
  getOtherLang: () => Language,
  playAudio: PlayAudio<T>
): ((category: Category) => NarratorPhrase<T>) => {
  const getPhrase = (category: Category) => {
    const phraseId = getRandomItem(NARRATOR_PHRASES_IDS[category]);

    return new NarratorPhrase(dictionary.phrases[phraseId], playAudio, getCurrentLang, getOtherLang);
  };

  return getPhrase;
};
