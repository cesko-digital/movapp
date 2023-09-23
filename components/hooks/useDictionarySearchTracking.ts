import { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { usePlausible } from 'next-plausible';

/* eslint-disable no-console */

export const useDictionarySearchTracking = (isSearching: boolean) => {
  const plausible = usePlausible();
  const { currentLanguage } = useLanguage();

  const enabledSearchTracking = useRef(true);

  // track when user searches in dictionary
  useEffect(() => {
    if (enabledSearchTracking.current && isSearching) {
      plausible('Dictionary-search', { props: { language: currentLanguage } });
      console.log('The user searched in the dictionary. The event was sent to Plausible.');
      enabledSearchTracking.current = false;
    }
  }, [currentLanguage, isSearching, plausible]);
};
