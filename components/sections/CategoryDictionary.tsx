import { TranslationContainer as TranslationContainer } from 'components/basecomponents/TranslationsContainer';
import { Phrase2 } from '../../utils/getDictionaryData';

interface CategoryDictionaryProps {
  translations: Phrase2[];
  searchText: string;
}

export const CategoryDictionary = ({ translations, searchText }: CategoryDictionaryProps): JSX.Element => {
  return (
    <>
      {translations.map((translation, index) => {
        return <TranslationContainer key={index} translation={translation} searchText={searchText} />;
      })}
    </>
  );
};
