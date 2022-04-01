import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { SearchInput } from 'components/basecomponents/Input';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { translations } from 'data/translations/translations';
export { getStaticProps } from 'utils/localization';
import Marker from 'react-mark.js/Marker';
import { TranslationContainer, TranslationType } from '../../components/basecomponents/TranslationsContainer';
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
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const { t, i18n } = useTranslation();
  const [flattenTranslations, setFlattenTranslations] = useState<TranslationType[] | []>([]);
  const [maxItems, setMaxItems] = useState(20);
  const lastContainerRef = useRef<HTMLDivElement | null>(null);
  const searchContainer = useRef<HTMLDivElement | null>(null);

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

  // scroll to top when items in translations container are not visible in view port
  useEffect(() => {
    const element = searchContainer.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        const el = e.target as HTMLElement;
        if (e.intersectionRatio < 1) {
          el.style.margin = '0px -8px';
          el.style.width = 'auto';
        } else if (e.intersectionRatio >= 1) {
          el.style.margin = '0px 0px';
        }
      },
      { threshold: [1], rootMargin: '-57px 0px 0px 0px' },
    );

    element && observer.observe(element);

    return () => {
      element && observer.unobserve(element);
    };
  });

  const filterBySearch = ({ cz_translation, ua_translation }: TranslationType) => {
    const searchText = normalizeForSearch(search);
    return normalizeForSearch(cz_translation).includes(searchText) || normalizeForSearch(ua_translation).includes(searchText);
  };

  useEffect(() => {
    const flatTranslations = translations.map(({ translations }) => translations).flat();
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
        <div ref={searchContainer} className="flex items-center sticky  top-14 w-full transition-all duration-1000">
          <SearchInput
            id="search"
            hiddenLabel
            label={t('dictionary_page.search_input_label')}
            placeholder={t('dictionary_page.search_placeholder')}
            type="text"
            value={search}
            resetInput={() => setSearch('')}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Button
            className="ml-5 justify-self-end border-1 hidden self-end md:block bg-primary-yellow"
            text={t('dictionary_page.search_button')}
          />
        </div>
        <ExportTranslations
          translations={translations.map((translations) => translations.translations).flat()}
          categoryName={t('export_translations.all_phrases')}
          trigger={
            <span className="cursor-pointer py-2 underline text-primary-blue inline-block">
              {t('export_translations.download')} {t('export_translations.all_phrases')}
            </span>
          }
        />
        <h2 className="text-primary-blue">{t(search.trim() ? 'dictionary_page.results_subtitle' : 'dictionary_page.subtitle')}</h2>
        {search.trim() === '' &&
          translations.map((category, index) => {
            const mainLanguageCategory = i18n.language === 'cs' ? category.category_name_cz : category.category_name_ua;
            const secondaryLanguageCategory = i18n.language === 'cs' ? category.category_name_ua : category.category_name_cz;

            // swaps category titles according to choosen locale
            const categoryName = `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;

            return (
              <Collapse
                index={index}
                id={category.category_name_cz.toLowerCase().replace(/\s+/g, '_')}
                key={category.category_name_cz}
                title={<Marker mark={search}>{categoryName}</Marker>}
                ariaId={category.category_name_cz}
              >
                <div className="mb-4 mx-4">
                  <ExportTranslations translations={category.translations} categoryName={categoryName} />
                </div>
                <CategoryDictionary setPlayer={setPlayer} player={player} searchText={search} translations={category.translations} />
              </Collapse>
            );
          })}
        <div ref={translationsContainerRef}>
          {search.trim() &&
            flattenTranslations
              .filter(filterBySearch)
              .slice(0, maxItems)
              .map((translation, index) => {
                return (
                  <TranslationContainer
                    ref={lastContainerRef}
                    key={index}
                    {...translation}
                    setPlayer={setPlayer}
                    player={player}
                    searchText={search}
                  />
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Dictionary;
