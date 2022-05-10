import { useLanguage } from 'utils/useLanguageHook';
import { Phrase, TranslationJSON } from 'utils/Phrase';
import { Language } from 'utils/locales';
import { CardType } from './MemoryGame';

const playTextToSpeech = (text: string, language: Language): Promise<number> =>
  new Promise((resolve) => {
    const source = `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;
    const sound = new Audio(source);

    sound.onerror = () => {
      console.warn(sound!.error!.message);
      setTimeout(() => resolve(1000), 1000);
    };
    sound.onabort = () => {
      console.warn('Audio play aborted');
      setTimeout(() => resolve(1000), 1000);
    };
    sound.oncanplaythrough = () => {
      sound.play();
    };
    sound.onended = () => resolve(sound!.duration);

    setTimeout(() => {
      resolve(0); // timed out resolve safety
    }, 7000);
  });

const usePlayPhrase = () => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const playCardPhraseCurrentLang = (card: CardType) =>
    playTextToSpeech(new Phrase(card.translation).getTranslation(currentLanguage), currentLanguage);

  const playCardPhraseOtherLang = (card: CardType) =>
    playTextToSpeech(new Phrase(card.translation).getTranslation(otherLanguage), otherLanguage);

  const playPhraseOtherLang = (phrase: TranslationJSON) =>
    playTextToSpeech(new Phrase(phrase).getTranslation(otherLanguage), otherLanguage);

  const playPhraseCurrentLang = (phrase: TranslationJSON) =>
    playTextToSpeech(new Phrase(phrase).getTranslation(currentLanguage), currentLanguage);

  const playPhraseRandomLang = (phrase: TranslationJSON) =>
    Math.random() < 0.5 ? playPhraseOtherLang(phrase) : playPhraseCurrentLang(phrase);

  return { playCardPhraseCurrentLang, playCardPhraseOtherLang, playPhraseCurrentLang, playPhraseOtherLang, playPhraseRandomLang };
};

export default usePlayPhrase;
