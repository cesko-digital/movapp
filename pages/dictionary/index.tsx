import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { SearchInput } from 'components/basecomponents/Input';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { categories, Category } from 'data/translations/translations';
export { getStaticProps } from 'utils/localization';
import Marker from 'react-mark.js/Marker';
import { translit } from 'utils/transliterate';
import { ua2cz } from 'data/transliterations/ua2cz';
import { useLanguage } from 'utils/useLanguageHook';
import { normalizeForCategoryLink, normalizeForId, normalizeForSearch } from 'utils/textNormalizationUtils';
import { DictionarySearchResults } from 'components/sections/DictionarySearchResults';
import { Language } from 'data/locales';
// Disable ssr for this component to avoid Reference Error: Blob is not defined
const ExportTranslations = dynamic(() => import('../../components/sections/ExportTranslations'), {
  ssr: false,
});

const allTranslations = categories.map((category) => category.translations).flat();

const getCategoryName = (category: Category, currentLanguage: Language) => {
  const mainLanguageCategory = currentLanguage === 'cs' ? category.category_name_cz : category.category_name_ua;
  const secondaryLanguageCategory = currentLanguage === 'cs' ? category.category_name_ua : category.category_name_cz;
  return `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;
};

// Used to link directly to category with dictionary#categoryId
const getCategoryId = (category: Category, currentLanguage: Language) => {
  const categoryLink =
    currentLanguage === 'cs'
      ? normalizeForCategoryLink(category.category_name_cz)
      : translit(ua2cz, category.category_name_ua.toLowerCase());
  return normalizeForId(categoryLink);
};

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const [isSticky, setIsSticky] = useState(false);

  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButton = useRef<HTMLButtonElement | null>(null);

  const isSearching = search.trim().length > 0;

  // scrolls to top whenever user type in search input
  useEffect(() => {
    if (isSearching || window.scrollY === 0) return;
    window.scrollTo({
      top: 0,
    });
  }, [isSearching]);

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

  const filteredTranslations = useMemo(() => {
    const searchText = normalizeForSearch(search);
    const matches = allTranslations.filter((translation) =>
      normalizeForSearch(translation.otherTranslation + translation.ukTranslation).includes(searchText)
    );
    const uniqueMathces = matches.filter(
      (match, index) => matches.findIndex((phrase) => phrase.otherTranscription === match.otherTranscription) === index
    );
    return uniqueMathces;
  }, [search]);

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
          translations={allTranslations}
          categoryName={t('export_translations.all_phrases')}
          trigger={
            <span className="cursor-pointer py-2 underline text-primary-blue inline-block">
              {t('export_translations.download')} {t('export_translations.all_phrases')}
            </span>
          }
        />
        <h2 className="text-primary-blue">{t(isSearching ? 'dictionary_page.results_subtitle' : 'dictionary_page.subtitle')}</h2>
        {isSearching ? (
          <DictionarySearchResults search={search} results={filteredTranslations} />
        ) : (
          categories.map((category, index) => {
            const categoryName = getCategoryName(category, currentLanguage);
            return (
              <Collapse
                index={index}
                id={getCategoryId(category, currentLanguage)}
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
          })
        )}
      </div>
    </>
  );
};

export default Dictionary;
