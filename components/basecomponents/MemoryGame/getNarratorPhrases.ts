import { DictionaryDataObject, getCategories, PhraseDataObject } from 'utils/getDataUtils';

export enum Category {
  good = 'good',
  wrong = 'wrong',
  newGame = 'newGame',
  win = 'win',
}

const NARRATOR_PHRASES_IDS = {
  good: ['recQNGsOmqZZqfaWk', 'recyVofgBLyNQuzwb', 'recy7qKMbsuME37jh', 'recpmWDOj6I4CDEBM', 'rec4VuOdYDuJKGumf'],
  wrong: ['reclGajD1aVNAYpnJ', 'recTs2905OPays42Z', 'rec9Zrh723Pikrh1F'],
  newGame: ['recjnm1SPnUJFVJCw', 'recC4L2fmipjcDF6i'],
  win: ['recnQaCaCF8Bsob0g', 'recwFVrr9aDARuxOk', 'rec3Xdb5QAjNFr7ob', 'recmYthRZ57qOfBVU'],
};

const getNarratorPhrases = (dictionary: DictionaryDataObject) => {
  const NARRATOR_PHRASES_CATEGORY = 'rec4bnE1FDvucna8y';
  const phrases = getCategories(dictionary).find(({ id }) => id === NARRATOR_PHRASES_CATEGORY)?.translations;

  if (phrases === undefined) throw Error(`Can't get narrator phrases!`);

  const findPhrase = (searchId: PhraseDataObject['id']) => phrases.find((phrase) => phrase.getId() === searchId);

  return Object.entries(NARRATOR_PHRASES_IDS).reduce((acc, [key, value]) => ({ ...acc, [key]: value.map(findPhrase) }), {});
};

export default getNarratorPhrases;
