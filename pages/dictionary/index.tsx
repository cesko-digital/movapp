import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { SearchInput } from 'components/basecomponents/Input';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { translations, TranslationsType } from 'data/translations/translations';
export { getStaticProps } from 'utils/localization';
import Marker from 'react-mark.js/Marker';
import { Translation } from '../../components/basecomponents/Translation';
import { TranslationContainer, TranslationType } from '../../components/basecomponents/TranslationsContainer';
// Disable ssr for this component to avoid Reference Error: Blob is not defined
const ExportTranslations = dynamic(() => import('../../components/sections/ExportTranslations'), {
  ssr: false
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

  const translationsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const searchedTranslationContainerRect = translationsContainerRef.current?.getBoundingClientRect();
    if (!searchedTranslationContainerRect) return;

    if (searchedTranslationContainerRect.height === 0 || searchedTranslationContainerRect.bottom < 0) {
      window.scrollTo({
        top: 0
      });
    }
    console.log('cse', searchedTranslationContainerRect);
  }, [search]);

  const filterBySearch = ({ cz_translation, ua_translation }: TranslationType) => {
    const searchText = normalizeForSearch(search);

    return normalizeForSearch(cz_translation).includes(searchText) || normalizeForSearch(ua_translation).includes(searchText);
  };

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
        <div className="flex items-center sticky  top-20 w-full">
          <SearchInput
            className=" md:w-auto block  flex-1 "
            placeholder={t('dictionary_page.search_placeholder')}
            type="text"
            value={search}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Button className="mx-5 hidden md:block bg-primary-yellow" text={t('dictionary_page.search_button')} />
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
        <h2 className="text-primary-blue">{t('dictionary_page.subtitle')}</h2>
        {search.trim() === '' &&
          translations.map((category) => {
            const mainLanguageCategory = i18n.language === 'cs' ? category.category_name_cz : category.category_name_ua;
            const secondaryLanguageCategory = i18n.language === 'cs' ? category.category_name_ua : category.category_name_cz;

            // swaps category titles according to choosen locale
            const categoryName = `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;

            return (
              <Collapse
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
        <div className="" ref={translationsContainerRef}>
          {search.trim() &&
            translations
              .map(({ translations }) => translations)
              .flat()
              .filter(filterBySearch)
              .map((translation) => {
                return <TranslationContainer {...translation} setPlayer={setPlayer} player={player} searchText={search} />;
              })}
        </div>
      </div>
    </>
  );
};

export default Dictionary;
