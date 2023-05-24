import { Language } from './locales';

/**
 * A singleton AudioPlayer class
 * (there is only ever one instance of this class that is tracking the currently playing audio)
 * Usage: AudioPlayer.getInstance().playTextToSpeech(text, language)
 */
export class AudioPlayer {
  private static instance: AudioPlayer | null = null;
  currentAudio: HTMLAudioElement = new Audio();
  resolveCurrentAudio: (() => void) | null = null;

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

    this.playSrc(newAudio.src);
  };

  pause = () => {
    if (!this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  };

  playSrc = (src: string, playbackRate = 1) => {
    this.currentAudio.pause();
    if (this.resolveCurrentAudio !== null) this.resolveCurrentAudio();
    this.currentAudio.src = src;
    this.currentAudio.load();

    if (this.currentAudio.playbackRate !== undefined) {
      this.currentAudio.playbackRate = playbackRate;
    }

    return new Promise<void>((resolve) => {
      this.resolveCurrentAudio = resolve;
      this.currentAudio.oncanplay = () => {
        this.currentAudio.play().catch(() => {
          resolve();
        });
      };
      this.currentAudio.onerror = () => {
        resolve();
      };
      this.currentAudio.onabort = () => {
        resolve();
      };
      this.currentAudio.onended = () => {
        resolve();
      };
    });
  };

  getGoogleTTSAudio = (text: string, language: Language) => {
    return `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;
  };

  playTextToSpeech = (text: string, language: Language) => {
    return this.playSrc(this.getGoogleTTSAudio(text, language));
  };
}
