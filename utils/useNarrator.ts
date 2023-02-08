/**
 * usage:
 *
 *  GetPhrase function returns NarratorPhrase that has methods to play random audio phrase of choosen category in current or other language.
 *  eg. getPhrase(Category.good).playCurrentLanguage()
 *
 *  in React Component
 *  const narrator = useNarrator(dictionary, playAudio);
 *
 * @param {DictionaryDataObject} dictionary
 *  dictionary: full dictionary with hidden categories, use fetchFullDictionary()
 *  ---------------
 *  static props in React Component
 *  export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
 *  const dictionary = await fetchFullDictionary();
 *  ...
 *  ---------------
 * @param {(soundUrl: string) => T} playAudio: function to play sound of given url
 *    eg. const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
 *    allows to use own function decorated with own stuff
 *    eg. const playAudio = (str: string) => makeCancelablePromise(AudioPlayer.getInstance().playSrc(str));
 *
 * @template T Return type of playAudio function
 */

import { useMemo } from 'react';
import { DictionaryDataObject } from 'utils/getDataUtils';
import { useLanguage } from 'utils/useLanguageHook';
import { createNarrator } from './narrator';

const useNarrator = <T>(dictionary: DictionaryDataObject, playAudio: (soudUrl: string) => T) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const getPhrase = useMemo(
    () =>
      createNarrator(
        dictionary,
        () => currentLanguage,
        () => otherLanguage,
        playAudio
      ),
    [dictionary, currentLanguage, otherLanguage, playAudio]
  );

  return getPhrase;
};

export default useNarrator;
