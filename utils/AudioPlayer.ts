import { Language } from './locales';

/**
 * A singleton AudioPlayer class
 * (there is only ever one instance of this class that is tracking the currently playing audio)
 * Usage: AudioPlayer.getInstance().playTextToSpeech(text, language)
 */
export class AudioPlayer {
  private static instance: AudioPlayer | null = null;
  currentAudio: HTMLAudioElement = new Audio();

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

  playSrc = (src: string) => {
    this.currentAudio.pause();
    this.currentAudio.src = src;
    this.currentAudio.load();

    return new Promise<void>((resolve) => {
      this.currentAudio.oncanplay = () => {
        console.log('ready to play', this.currentAudio.src);
        this.currentAudio.play().catch(() => {
          console.log('catch', this.currentAudio.src);            
          resolve();
        });
      };
      this.currentAudio.onerror = () => {
        console.log('error', this.currentAudio.src);          
        resolve();
      };
      this.currentAudio.onabort = () => {
        console.log('aborted', this.currentAudio.src);          
        resolve();
      };
      this.currentAudio.onpause = () => {
        console.log('paused', this.currentAudio.src);          
      };
      this.currentAudio.onended = () => {
        console.log('ended', this.currentAudio.src);          
        resolve();
      };
    });    
  }

  getGoogleTTSAudio = (text: string, language: Language) => {
    return `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;    
  };

  playTextToSpeech = (text: string, language: Language) => {
    this.playSrc(this.getGoogleTTSAudio(text, language));
  };  
}
