import { Language } from '../../data/locales';

export const playGoogleTTSAudio = (language: Language, text: string, player: HTMLMediaElement | null) => {
  // stops player if something is currently playing
  if (player) {
    player.pause();
    player.currentTime = 0;
  }
  const source = `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;
  const audio = new Audio(source);
  audio.play();
  return audio;
};
