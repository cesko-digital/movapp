import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { Marker } from 'react-mark.js';
import { useLanguage } from 'utils/useLanguageHook';
import { normalize } from 'utils/textNormalizationUtils';
import { DictionarySearchResults } from 'components/sections/DictionarySearchResults';
import { getCountryVariant } from 'utils/locales';
import SEO from 'components/basecomponents/SEO';
import SearchInput from 'components/basecomponents/SearchInput';
import { DictionaryDataObject, fetchDictionary, getAllPhrases, getCategories } from '../../utils/getDataUtils';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getServerSideTranslations } from '../../utils/localization';
import { TextLink } from '../../components/Typography';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { getCategoryName, getCategoryId, getCategoryUkId } from '../../components/sections/Dictionary/dictionaryUtils';

// Disable ssr for this component to avoid Reference Error: Blob is not defined
const ExportTranslations = dynamic(() => import('../../components/sections/ExportTranslations'), {
  ssr: false,
});

const Dictionary = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const categories = useMemo(() => getCategories(dictionary), [dictionary]);
  const allTranslations = useMemo(() => getAllPhrases(dictionary), [dictionary]);

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
    const searchText = normalize(search);
    const matches = allTranslations.filter((translation) =>
      normalize(translation.getTranslation() + translation.getTranslation('uk')).includes(searchText)
    );
    const uniqueMathces = matches.filter(
      (match, index) => matches.findIndex((phrase) => phrase.getTranscription() === match.getTranscription()) === index
    );
    return uniqueMathces;
  }, [search, allTranslations]);

  return (
    <>
      <SEO
        title={t(`seo.dictionary_page_title.${getCountryVariant()}`)}
        description={t(`seo.dictionary_page_description.${getCountryVariant()}`)}
      />
      <div>
        <div className="max-w-7xl m-auto ">
          <h1 className="text-primary-blue">{t(`dictionary_page.title.${getCountryVariant()}`)}</h1>
          <p className="text-base pb-2 md:text-xl">{t(`dictionary_page.description.${getCountryVariant()}`)}</p>
          <div
            ref={searchContainer}
            className={`${
              isSticky ? 'bg-primary-blue transition duration-500  -mx-2 w-auto px-2' : 'm-0 '
            } flex items-center sticky top-14  transition-all duration-500 pb-2`}
          >
            <SearchInput
              id="search"
              hiddenLabel
              label={t('dictionary_page.search_input_label')}
              placeholder={t('dictionary_page.search_placeholder')}
              value={search}
              resetInput={() => setSearch('')}
              setSearch={setSearch}
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
            category={categories}
            customName={t('export_translations.all_phrases')}
            triggerLabel={`${t('export_translations.export')} ${t('export_translations.all_phrases')}`}
          />
          <h2 className="text-primary-blue">{t(isSearching ? 'dictionary_page.results_subtitle' : 'dictionary_page.subtitle')}</h2>
          {isSearching ? (
            <DictionarySearchResults search={search} results={filteredTranslations} />
          ) : (
            categories.map((category, index) => {
              const categoryName = getCategoryName(category, currentLanguage);
              const categoryPdfName = currentLanguage === 'uk' ? category.nameUk : category.nameMain;
              return (
                <div key={category.nameMain} id={getCategoryId(category, currentLanguage)}>
                  <Collapse
                    index={index}
                    id={getCategoryUkId(category)}
                    title={<Marker mark={search}>{categoryName}</Marker>}
                    ariaId={category.nameMain}
                    category={category}
                  >
                    <div className="mb-4 mx-4">
                      <ExportTranslations category={category} />
                      <TextLink
                        href={`/pdf/${categoryPdfName}.pdf`}
                        target="_blank"
                        className="ml-3 inline-flex gap-x-1 items-center"
                        locale={getCountryVariant()}
                      >
                        <AiOutlineFilePdf className="w-5 h-5" />
                        {t('dictionary_page.download_pdf')}
                      </TextLink>
                    </div>
                    <CategoryDictionary searchText={search} translations={category.translations} />
                  </Collapse>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default Dictionary;
