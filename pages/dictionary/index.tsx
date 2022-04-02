import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Collapse } from 'components/basecomponents/Collapse';
import { SearchInput } from 'components/basecomponents/Input';
import { CategoryDictionary } from 'components/sections/CategoryDictionary';
import { translations, TranslationsType } from 'data/translations/translations';
export { getStaticProps } from 'utils/localization';
import Marker from 'react-mark.js/Marker';
// Disable ssr for this component to avoid Reference Error: Blob is not defined
const ExportTranslations = dynamic(() => import('components/sections/ExportTranslations'), {
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

  // filter category name and translations by search input
  const filterBySearch = ({ category_name_cz, category_name_ua, translations }: TranslationsType) => {
    const UACategoryName = normalizeForSearch(category_name_ua);
    const CZCategoryName = normalizeForSearch(category_name_cz);

    const searchText = normalizeForSearch(search);
    // filter category name
    const matchesCategoryTitle = CZCategoryName.includes(searchText) || UACategoryName.includes(searchText);
    // filter translations
    const matchesTranslations = translations.filter(({ cz_translation, ua_translation }) => {
      return normalizeForSearch(cz_translation).includes(searchText) || normalizeForSearch(ua_translation).includes(searchText);
    });

    return matchesCategoryTitle || matchesTranslations.length > 0;
  };

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>{t('seo.dictionary_page_title')}</title>
        <meta name="description" content={t('seo.dictionary_page_description')} />
        <meta name="twitter:title" content={t('seo.dictionary_page_title')} />
      </Head>
      <div className="max-w-7xl m-auto ">
        <h1 className="text-primary-blue">{t('dictionary_page.title')}</h1>
        <div className="flex items-center">
          <SearchInput
            className="w-full md:w-auto "
            placeholder={t('dictionary_page.search_placeholder')}
            type="text"
            value={search}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Button className="mx-5 hidden md:block " text={t('dictionary_page.search_button')} />
          <ExportTranslations
            translations={translations.map((translations) => translations.translations).flat()}
            categoryName={t('export_translations.all_phrases')}
            trigger={
              <span className="cursor-pointer underline text-primary-blue inline-block">
                {t('export_translations.download')} {t('export_translations.all_phrases')}
              </span>
            }
          />
        </div>
        <h2 className="text-primary-blue">{t('dictionary_page.subtitle')}</h2>
        {translations.filter(filterBySearch).map((category) => {
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
      </div>
    </>
  );
};

export default Dictionary;
