import { Phrase } from 'utils/getDataUtils';
import { shuffleArray } from 'utils/collectionUtils';
import { CONFIG, CONFIG_BASE } from '../exerciseStoreConfig';
import { Language } from 'utils/locales';

/* eslint-disable no-console */

type EqualPhrase = (phraseA: Phrase) => (phraseB: Phrase) => boolean;

type GreatPhraseFilter = (
  getCurrentLanguage: () => Language,
  level: number,
  phrases: Phrase[],
  fallbackPhrases: Phrase[],
  config: { wordLimitMin: number; wordLimitMax: number; choiceLimit: number; levelMin: number }
) => Phrase[];

// new better phrase filter :-)
export const greatPhraseFilter: GreatPhraseFilter = (getCurrentLanguage, level, phrases, fallbackPhrases, config) => {
  // first it gets random number from range and then accept phrases that have this number of words (in current language)
  const range = config.wordLimitMax - config.wordLimitMin;
  // create Array of filters for all numbers in range
  const filters: ((phrase: Phrase) => boolean)[] = shuffleArray(
    Array(range + 1)
      .fill(0)
      .map((e, i) => i + config.wordLimitMin)
      .map((e) => (phrase: Phrase) => phrase.getTranslation(getCurrentLanguage()).split(' ').length === e)
  );

  const filterPhrases = (filters: ((phrase: Phrase) => boolean)[], phrases: Phrase[]) =>
    filters.map((filter) => shuffleArray(phrases.filter(filter))).flat();

  let filteredPhrases = filterPhrases(filters, phrases);

  const filterDuplicatePhrases = (phrase: Phrase, index: number, array: Phrase[]) => array.findIndex(equalPhrase(phrase)) === index;

  // if it fails then lower level
  if (filteredPhrases.length < config.choiceLimit) {
    // can't lower the level anymore
    if (level === CONFIG_BASE.levelMin) {
      // add fallback phrases
      console.warn('using fallback Phrases');
      const filteredFallbackPhrases = filterPhrases(filters, fallbackPhrases);
      filteredPhrases = [...filteredPhrases, ...filteredFallbackPhrases].filter(filterDuplicatePhrases);
      if (filteredPhrases.length < config.choiceLimit) throw Error('Insuficient phrases to construct the Exercise');
    } else {
      // widen word limit range by lower level min value
      filteredPhrases = greatPhraseFilter(getCurrentLanguage, level - 1, phrases, fallbackPhrases, {
        ...CONFIG[level - 1],
        wordLimitMax: config.wordLimitMax, // keep word max limit
        choiceLimit: config.choiceLimit, // keep current choice limit
      });
    }
  }

  // if it fails than tear your hair
  if (filteredPhrases.length < config.choiceLimit) throw Error('Insuficient phrases to construct the Exercise');

  console.log(`${filteredPhrases.length} usable phrases`);

  return filteredPhrases;
};

export const equalPhrase: EqualPhrase = (a) => (b) => a.getTranslation().toLocaleLowerCase() === b.getTranslation().toLocaleLowerCase();
