import React from 'react';
import { Translation, TranslationContainer } from '../basecomponents/TranslationContainer';

interface CategoryDictionaryProps {
  translations: Translation[];
}

export const CategoryDictionary = ({ translations }: CategoryDictionaryProps): JSX.Element => {
  return (
    <>
      {translations.map((translation, index) => {
        return <TranslationContainer key={index} {...translation} />;
      })}
    </>
  );
};
