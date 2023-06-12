import { AudioPlayer } from 'utils/AudioPlayer';
export const playAudio = (url: string, slow = false) => AudioPlayer.getInstance().playSrc(url, slow ? 0.75 : 1);
