import React from 'react';
import { Translation, TranslationContainer } from '../basecomponents/TranslationContainer';

interface CategoryDictionaryProps {
  translations: Translation[];
  searchText: string;
  setAudioIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioIsPlaying: boolean;
}

export const CategoryDictionary = ({
  translations,
  setAudioIsPlaying,
  audioIsPlaying,
  searchText,
}: CategoryDictionaryProps): JSX.Element => {
  return (
    <>
      {translations.map((translation, index) => {
        return (
          <TranslationContainer
            key={index}
            {...translation}
            setAudioIsPlaying={setAudioIsPlaying}
            audioIsPlaying={audioIsPlaying}
            searchText={searchText}
          />
        );
      })}
    </>
  );
};
