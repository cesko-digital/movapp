import { useMemo } from 'react';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import getNarratorPhrases, { Category } from './getNarratorPhrases';
import { DictionaryDataObject } from 'utils/getDataUtils';

const getRandomElement = <Type>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];

const useNarratorPhrases = (dictionary: DictionaryDataObject) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const narratorPhrases = useMemo(() => getNarratorPhrases(dictionary), [dictionary]);

  const playPhraseOtherLang = (category: Category) =>
    AudioPlayer.getInstance().playSrc(getRandomElement(narratorPhrases[category]).getSoundUrl(otherLanguage));

  const playPhraseCurrentLang = (category: Category) =>
    AudioPlayer.getInstance().playSrc(getRandomElement(narratorPhrases[category]).getSoundUrl(currentLanguage));

  const playPhraseRandomLang = (category: Category) =>
    Math.random() < 0.5 ? playPhraseOtherLang(category) : playPhraseCurrentLang(category);

  return {
    playPhraseCurrentLang,
    playPhraseOtherLang,
    playPhraseRandomLang,
  };
};

export default useNarratorPhrases;
