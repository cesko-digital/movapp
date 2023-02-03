/**
 * usage:
 *
 *  It plays random audio phrase of choosen category.
 *  narrator.<language>.<category>.play()
 *  eg. narrator.currentLanguage.good.play();
 *
 *  in React Component
 *  const narrator = useNarrator<Promise<void>>(dictionary, playAudio);
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
import { extractNarratorPhrases, createInterface } from './narrator';

// include default playAudio function ???

const useNarrator = <T>(dictionary: DictionaryDataObject, playAudio: (soudUrl: string) => T) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const narratorPhrases = useMemo(() => extractNarratorPhrases(dictionary), [dictionary]);

  const narrator = useMemo(
    () =>
      createInterface(
        narratorPhrases,
        () => currentLanguage,
        () => otherLanguage,
        playAudio
      ),
    [narratorPhrases, currentLanguage, otherLanguage, playAudio]
  );

  return narrator;
};

export default useNarrator;
