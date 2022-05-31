import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase, TranslationJSON } from 'utils/Phrase';
import { Card } from './MemoryGameCore';

const usePlayPhrase = () => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const playCardPhraseCurrentLang = (card: Card) =>
    AudioPlayer.getInstance().playTextToSpeechAsync(new Phrase(card.translation).getTranslation(currentLanguage), currentLanguage);

  const playCardPhraseOtherLang = (card: Card) =>
    AudioPlayer.getInstance().playTextToSpeechAsync(new Phrase(card.translation).getTranslation(otherLanguage), otherLanguage);

  const playPhraseOtherLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeechAsync(new Phrase(phrase).getTranslation(otherLanguage), otherLanguage);

  const playPhraseCurrentLang = (phrase: TranslationJSON) =>
    AudioPlayer.getInstance().playTextToSpeechAsync(new Phrase(phrase).getTranslation(currentLanguage), currentLanguage);

  const playPhraseRandomLang = (phrase: TranslationJSON) =>
    Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase);

  return { playCardPhraseCurrentLang, playCardPhraseOtherLang, playPhraseCurrentLang, playPhraseOtherLang, playPhraseRandomLang };
};

export default usePlayPhrase;
