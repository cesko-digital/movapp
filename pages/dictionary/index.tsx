import React, { ReactElement, useState } from 'react';
import { Collapse } from '../../components/basecomponents/Collapse';
import { CategoryDictionary } from '../../components/sections/CategoryDictionary';
import { translations, TranslationsType } from '../../new-translations/translations';
import { getHighlightedText } from '../../utils/getHighlightedText';

const Dictionary = () => {
  const [search, setSearch] = useState('');

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
    <div className="max-w-4xl m-auto">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
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
