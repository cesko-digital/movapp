import { useContext } from 'react';
import { PhrasesContext } from './PhrasesContext';
import { getCountryVariant } from 'utils/locales';
import { Phrase } from 'utils/getDataUtils';
import { TranslationJSON } from 'utils/Phrase_deprecated';

export type CardData = {
  image: string;
  translation: TranslationJSON;
};

export const normalizeData = (phrase: Phrase) => ({
  translation: {
    uk: phrase.getTranslation('uk'),
    main: phrase.getTranslation(getCountryVariant()),
  },
  image: phrase.getImageUrl() ?? '',
});

export const useCardsData = (): CardData[] => {
  const phrases = useContext(PhrasesContext);
  return phrases.map(normalizeData);
};

export default useCardsData;
