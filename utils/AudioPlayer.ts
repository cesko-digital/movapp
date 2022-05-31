import { Language } from './locales';

/**
 * A singleton AudioPlayer class
 * (there is only ever one instance of this class that is tracking the currently playing audio)
 * Usage: AudioPlayer.getInstance().playTextToSpeech(text, language)
 */
export class AudioPlayer {
  private static instance: AudioPlayer | null = null;
  currentAudio: HTMLAudioElement | null = null;

  // Prohibits creating new instances outside the class using 'new AudioPlayer()'
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): AudioPlayer {
    if (!this.instance) {
      this.instance = new AudioPlayer();
    }

    return this.instance;
  }

  play = (newAudio: HTMLAudioElement | null) => {
    if (!newAudio) {
      return;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    newAudio.play();
    this.currentAudio = newAudio;
  };

  getGoogleTTSAudio = (text: string, language: Language) => {
    const source = `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;
    return new Audio(source);
  };

  playTextToSpeech = (text: string, language: Language) => {
    this.play(this.getGoogleTTSAudio(text, language));
  };

  playTextToSpeechAsync = (text: string, language: Language): Promise<void> => {
    const sound = this.getGoogleTTSAudio(text, language);
    this.play(sound);
    return new Promise((resolve) => {
      sound.onerror = () => {
        console.warn(sound?.error?.message);
        resolve();
      };
      sound.onabort = () => {
        console.warn('Audio play aborted');
        resolve();
      };
      sound.onpause = () => resolve();
      sound.onended = () => resolve();
    });
  };
}
