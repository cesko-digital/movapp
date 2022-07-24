import { TranslationContainer } from 'components/basecomponents/TranslationsContainer';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import { Phrase } from '../../utils/getDictionaryData';

interface DictionarySearchResultsProps {
  results: Phrase[];
  search: string;
}

export const DictionarySearchResults = ({ results: translations, search }: DictionarySearchResultsProps) => {
  const [maxItems, setMaxItems] = useState(20);
  const { t } = useTranslation();

  const translationsContainerRef = useRef<HTMLDivElement | null>(null);
  const lastContainerRef = useRef<HTMLDivElement | null>(null);

  //loads  more items once viewport is close enough to last element
  useEffect(() => {
    const lastTranslation = lastContainerRef.current;

    const options = {
      rootMargin: '100px',
      threshold: [0],
    };
    const observer = new IntersectionObserver(([entry]) => {
      const { intersectionRatio } = entry;
      if (intersectionRatio > 0 && intersectionRatio < 1) {
        setMaxItems((prev) => prev + 20);
      }
    }, options);

    lastTranslation && observer.observe(lastTranslation);

    return () => {
      lastTranslation && observer.unobserve(lastTranslation);
    };
  });

  return (
    <>
      {translations.length === 0 && (
        <div className="flex justify-center">
          <p className="text-primary-blue text-lg">{t('dictionary_page.not_found_results')}</p>
        </div>
      )}
      <div ref={translationsContainerRef}>
        {translations.slice(0, maxItems).map((translation, index) => {
          return <TranslationContainer ref={lastContainerRef} key={index} translation={translation} searchText={search} />;
        })}
      </div>
    </>
  );
};
