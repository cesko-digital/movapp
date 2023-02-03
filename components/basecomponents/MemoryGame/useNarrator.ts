import { useMemo } from 'react';
import { DictionaryDataObject } from 'utils/getDataUtils';
import { useLanguage } from 'utils/useLanguageHook';
import { extractNarratorPhrases, createInterface, NarratorDecorator } from './narrator';
import createCancelablePromiseStore from './cancelablePromiseStore';

const useNarrator = (dictionary: DictionaryDataObject) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const [makeCancelable, cancelAll] = useMemo(() => createCancelablePromiseStore(), []);

  const narratorPhrases = useMemo(() => extractNarratorPhrases(dictionary), [dictionary]);

  const narrator = useMemo(
    () =>
      createInterface(
        narratorPhrases,
        () => currentLanguage,
        () => otherLanguage,
        <NarratorDecorator>makeCancelable
      ),
    [narratorPhrases, currentLanguage, otherLanguage, makeCancelable]
  );

  return { ...narrator, cancelAll };
};

export default useNarrator;
