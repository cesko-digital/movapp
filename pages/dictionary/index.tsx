import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { SearchInput } from 'components/basecomponents/Input';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { categories } from 'data/translations/translations';
export { getStaticProps } from 'utils/localization';
import Marker from 'react-mark.js/Marker';
import { TranslationContainer } from '../../components/basecomponents/TranslationsContainer';
import { translit } from 'utils/transliterate';
import { ua2cz } from 'data/transliterations/ua2cz';
import { useLanguage } from 'components/utils/useLanguageHook';
import { Phrase } from 'components/utils/Phrase';
// Disable ssr for this component to avoid Reference Error: Blob is not defined
const ExportTranslations = dynamic(() => import('../../components/sections/ExportTranslations'), {
  ssr: false,
});

const normalizeForSearch = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const [flattenTranslations, setFlattenTranslations] = useState<Phrase[]>();
  const [filteredTranslations, setFilteredTranslations] = useState<Phrase[] | []>([]);
  const [maxItems, setMaxItems] = useState(20);
  const [isSticky, setIsSticky] = useState(false);

  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const lastContainerRef = useRef<HTMLDivElement | null>(null);
  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButton = useRef<HTMLButtonElement | null>(null);
  const translationsContainerRef = useRef<HTMLDivElement | null>(null);

  // scrolls to top whenever user type in search input
  useEffect(() => {
    if (!search.trim() || window.scrollY === 0) return;
    window.scrollTo({
      top: 0,
    });
  }, [search]);

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

  // track when search input becomes sticky to apply styles
  useEffect(() => {
    const element = searchContainer.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 1) {
          setIsSticky(true);
        } else if (e.intersectionRatio >= 1) {
          setIsSticky(false);
        }
      },
      { threshold: [1], rootMargin: '-57px 0px 0px 0px' }
    );

    element && observer.observe(element);

    return () => {
      element && observer.unobserve(element);
    };
  });

  // filters translation based on user search
  const filterTranslations = () => {
    const res = flattenTranslations?.reduce(
      (acc, cur) => {
        const searchText = normalizeForSearch(search);
        // checks if phrase is already in filtered translations to avoid filter duplicates
        if (cur.otherTranslation in acc.visited) {
          return acc;
        }
        if (normalizeForSearch(cur.otherTranslation).includes(searchText) || normalizeForSearch(cur.ukTranslation).includes(searchText)) {
          acc.visited[cur.otherTranslation] = true;
          acc.filtered.push(cur);
        }
        return acc;
      },
      { visited: {} as { [key: string]: boolean }, filtered: [] as Phrase[] }
    );

    res && setFilteredTranslations(res.filtered);
  };

  useEffect(() => {
    if (!search.trim()) return;
    filterTranslations();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [search]);

  // flatten translations array to prepare it for filtering
  useEffect(() => {
    const flatTranslations = categories.map(({ translations }) => translations).flat();
    setFlattenTranslations(flatTranslations);
  }, []);

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>{t('seo.dictionary_page_title')}</title>
        <meta name="description" content={t('seo.dictionary_page_description')} />
        <meta name="twitter:title" content={t('seo.dictionary_page_title')} />
      </Head>
      <div className="max-w-7xl m-auto">
        <h1 className="text-primary-blue">{t('dictionary_page.title')}</h1>
        <div
          ref={searchContainer}
          className={`${
            isSticky ? 'bg-primary-blue transition duration-500  -mx-2 w-auto px-2  pb-2' : 'm-0 '
          } flex items-center sticky   top-14  transition-all duration-500`}
        >
          <SearchInput
            id="search"
            hiddenLabel
            label={t('dictionary_page.search_input_label')}
            placeholder={t('dictionary_page.search_placeholder')}
            value={search}
            resetInput={() => setSearch('')}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Button
            ref={searchButton}
            className={`${
              isSticky ? 'text-black bg-primary-yellow' : 'bg-primary-blue'
            } ml-5 justify-self-center border-1 hidden self-center md:block `}
            text={t('dictionary_page.search_button')}
          />
        </div>
        <ExportTranslations
          translations={categories.map((translations) => translations.translations).flat()}
          categoryName={t('export_translations.all_phrases')}
          trigger={
            <span className="cursor-pointer py-2 underline text-primary-blue inline-block">
              {t('export_translations.download')} {t('export_translations.all_phrases')}
            </span>
          }
        />
        <h2 className="text-primary-blue">{t(search.trim() ? 'dictionary_page.results_subtitle' : 'dictionary_page.subtitle')}</h2>
        {search.trim() === '' &&
          categories.map((category, index) => {
            const mainLanguageCategory = currentLanguage === 'cs' ? category.category_name_cz : category.category_name_ua;
            const secondaryLanguageCategory = currentLanguage === 'cs' ? category.category_name_ua : category.category_name_cz;

            const categoryLink =
              currentLanguage === 'cs'
                ? category.category_name_cz
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '_')
                    .toLowerCase()
                : translit(ua2cz, category.category_name_ua.toLowerCase());
            // swaps category titles according to choosen locale
            const categoryName = `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;

            const normalizedId = categoryLink
              .replace(/[()]/g, '')
              .replace(/\s+/g, '_')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

            return (
              <Collapse
                index={index}
                id={normalizedId}
                key={category.category_name_cz}
                title={<Marker mark={search}>{categoryName}</Marker>}
                ariaId={category.category_name_cz}
              >
                <div className="mb-4 mx-4">
                  <ExportTranslations translations={category.translations} categoryName={categoryName} />
                </div>
                <CategoryDictionary searchText={search} translations={category.translations} />
              </Collapse>
            );
          })}
        {filteredTranslations.length === 0 && search.trim() && (
          <div className="flex justify-center">
            <p className="text-primary-blue text-lg">{t('dictionary_page.not_found_results')}</p>
          </div>
        )}
        <div ref={translationsContainerRef}>
          {search.trim() &&
            filteredTranslations.slice(0, maxItems).map((translation, index) => {
              return <TranslationContainer ref={lastContainerRef} key={index} translation={translation} searchText={search} />;
            })}
        </div>
      </div>
    </>
  );
};

export default Dictionary;
