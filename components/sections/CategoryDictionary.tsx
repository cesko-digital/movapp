import { Translation, TranslationContainer } from 'components/basecomponents/TranslationsContainer';

interface CategoryDictionaryProps {
  translations: Translation[];
  searchText: string;
}

export const CategoryDictionary = ({ translations, searchText }: CategoryDictionaryProps): JSX.Element => {
  return (
    <>
      {translations.map((translation, index) => {
        return <TranslationContainer key={index} {...translation} searchText={searchText} />;
      })}
    </>
  );
};
