import { getCountryVariant } from 'utils/locales';
import { Phrase } from 'utils/getDataUtils';
import { CardData } from './MemoryGame';

export const normalizeData = (phrase: Phrase) => ({
  translation: {
    uk: phrase.getTranslation('uk'),
    main: phrase.getTranslation(getCountryVariant()),
  },
  image: phrase.getImageUrl() ?? '',
});

export const getCardsData = (phrases: Phrase[] = []): CardData[] => {
  return phrases.map(normalizeData);
};

export default getCardsData;
