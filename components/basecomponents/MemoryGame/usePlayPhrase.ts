import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase_deprecated, TranslationJSON } from 'utils/Phrase_deprecated';

const usePlayPhrase = () => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const playPhraseOtherLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(phrase).getTranslation(otherLanguage), otherLanguage);

  const playPhraseCurrentLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(phrase).getTranslation(currentLanguage), currentLanguage);

  const playPhraseRandomLang = (phrase: TranslationJSON) =>
    Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase);

  return {
    playPhraseCurrentLang,
    playPhraseOtherLang,
    playPhraseRandomLang,
  };
};

export default usePlayPhrase;
