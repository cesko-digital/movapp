import React from 'react';
import { Collapse } from '../../components/basecomponents/Collapse';
import { CategoryDictionary } from '../../components/sections/CategoryDictionary';
import { translations } from '../../new-translations/translations';

const Dictionary = () => {
  return (
    <div className="max-w-4xl m-auto">
      {translations.map((category, index) => {
        const categoryName =
          `${category.category_name_ua}` +
          ' - ' +
          `${category.category_name_cz}`;
        return (
          <Collapse key={index} title={categoryName}>
            <CategoryDictionary translations={category.translations} />
          </Collapse>
        );
      })}
    </div>
  );
};

export default Dictionary;
