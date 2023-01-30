import { AudioPlayer } from 'utils/AudioPlayer';
import { Phrase } from 'utils/getDataUtils';
import { useLanguage } from 'utils/useLanguageHook';

const usePlayPhrase = () => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const playPhraseOtherLang = (phrase: Phrase) => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage));
  const playPhraseCurrentLang = (phrase: Phrase) => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(currentLanguage));
  const playPhraseRandomLang = (phrase: Phrase) => (Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase));

  return {
    playPhraseCurrentLang,
    playPhraseOtherLang,
    playPhraseRandomLang,
  };
};

export default usePlayPhrase;
