import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import { Button } from '../../components/basecomponents/Button';
import { Collapse } from '../../components/basecomponents/Collapse';
import { SearchInput } from '../../components/basecomponents/Input';
import { CategoryDictionary } from '../../components/sections/CategoryDictionary';
import { translations, TranslationsType } from '../../data/translations/translations';
import { getHighlightedText } from '../../utils/getHighlightedText';
export { getStaticProps } from '../../utils/localization';

const Dictionary = () => {
  const [search, setSearch] = useState('');
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);

  const { t } = useTranslation();

  const filterBySearch = ({ category_name_cz, category_name_ua, translations }: TranslationsType) => {
    const UACategoryName = category_name_ua.toLowerCase();
    const CZCategoryName = category_name_cz.toLowerCase();

    const searchText = search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const matchesCategoryTitle =
      CZCategoryName.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(searchText) ||
      UACategoryName.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(searchText);

    const matchesTranslations = translations.filter(({ cz_translation, ua_translation }) => {
      return (
        cz_translation
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(searchText) ||
        ua_translation
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(searchText)
      );
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
      <div className="min-h-screen max-w-7xl m-auto">
        <div className="flex items-center">
          <SearchInput
            className="w-full md:w-auto "
            placeholder={t('dictionary_page.search_placeholder')}
            type="text"
            value={search}
            onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
          />
          <Button className="ml-5 hidden md:block " text={t('dictionary_page.search_button')} />
        </div>
        <h2 className="text-primary-blue">{t('dictionary_page.subtitle')}</h2>
        {translations.filter(filterBySearch).map((category, index) => {
          const categoryName = `${category.category_name_ua}` + ' - ' + `${category.category_name_cz}`;
          let title: string | ReactElement = categoryName;
          if (search.trim()) {
            title = getHighlightedText(categoryName, search);
          }
          return (
            <Collapse key={index} title={title}>
              <CategoryDictionary
                audioIsPlaying={audioIsPlaying}
                setAudioIsPlaying={setAudioIsPlaying}
                searchText={search}
                translations={category.translations}
              />
            </Collapse>
          );
        })}
      </div>
    </>
  );
};

export default Dictionary;
