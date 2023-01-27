import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase_deprecated, TranslationJSON } from 'utils/Phrase_deprecated';
import { Card } from './MemoryGame';

const usePlayPhrase = () => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const playCardPhrase = (card: Card) => (card.useMainLang ? playCardPhraseCurrentLang(card) : playCardPhraseOtherLang(card));

  const playCardPhraseCurrentLang = (card: Card) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(card.translation).getTranslation(currentLanguage), currentLanguage);

  const playCardPhraseOtherLang = (card: Card) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(card.translation).getTranslation(otherLanguage), otherLanguage);

  const playPhraseOtherLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(phrase).getTranslation(otherLanguage), otherLanguage);

  const playPhraseCurrentLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeech(new Phrase_deprecated(phrase).getTranslation(currentLanguage), currentLanguage);

  const playPhraseRandomLang = (phrase: TranslationJSON) =>
    Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase);

  return {
    playCardPhrase,
    playCardPhraseCurrentLang,
    playCardPhraseOtherLang,
    playPhraseCurrentLang,
    playPhraseOtherLang,
    playPhraseRandomLang,
  };
};

export default usePlayPhrase;
