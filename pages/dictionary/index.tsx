import { useTranslation } from 'next-i18next';
import React, { ReactElement, useState } from 'react';
import { Button } from '../../components/basecomponents/Button';
import { Collapse } from '../../components/basecomponents/Collapse';
import { SearchInput } from '../../components/basecomponents/Input';
import { CategoryDictionary } from '../../components/sections/CategoryDictionary';
import { translations, TranslationsType } from '../../new-translations/translations';
import { getHighlightedText } from '../../utils/getHighlightedText';
export { getStaticProps } from '../../utils/localization';

const Dictionary = () => {
  const [search, setSearch] = useState('');

  const { t } = useTranslation();

  const filterBySearch = ({ category_name_cz, category_name_ua, translations }: TranslationsType) => {
    const UACategoryName = category_name_ua.toLowerCase();
    const CZCategoryName = category_name_cz.toLowerCase();
    const matchesCategoryTitle =
      CZCategoryName.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
          search
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase(),
        ) ||
      UACategoryName.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(
          search
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase(),
        );

    const matchesTranslations = translations.filter(({ cz, ua }) => {
      return (
        cz
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(search) ||
        ua
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(search)
      );
    });

    return matchesCategoryTitle || matchesTranslations.length > 0;
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center">
        <SearchInput
          placeholder={t('dictionary_page.search_placeholder')}
          type="text"
          value={search}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
        />
        <Button className="ml-5" text={t('dictionary_page.search_button')} />
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
            <CategoryDictionary searchText={search} translations={category.translations} />
          </Collapse>
        );
      })}
    </div>
  );
};

export default Dictionary;
