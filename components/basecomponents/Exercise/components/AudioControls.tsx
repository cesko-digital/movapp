import { forwardRef, useEffect, useRef } from 'react';
import { PlayButton } from './PlayButton';
import SpeakerIcon from 'public/icons/speaker.svg';
import { playAudio } from '../utils/playAudio';
import { animation } from '../utils/animation';

interface AudioControlsProps {
  AudioUrl: string;
  playOnMount?: boolean;
}

export const AudioControls = forwardRef<HTMLDivElement, AudioControlsProps>(({ AudioUrl, playOnMount = false }, ref) => {
  const speakerRef = useRef(null);
  const playRef = useRef(null);
  const playSlowRef = useRef(null);

  // Animate elements on mount
  useEffect(() => {
    const speaker = speakerRef.current;
    const playButton = playRef.current;
    const playSlowButton = playSlowRef.current;

    if (speaker === null || playButton === null || playSlowButton === null) return;
    animation.show(speaker, 300, 300);
    animation.show(playButton, 300, 350);
    animation.show(playSlowButton, 300, 400);
  }, []);

  // Play audio on component mount and language change
  useEffect(() => {
    if (playOnMount) playAudio(AudioUrl);
  }, [AudioUrl, playOnMount]);

  return (
    <div ref={ref} className={`grid grid-cols-3 gap-x-3 mb-5 mt-5`}>
      <div className={`w-12 h-12 relative`}>
        <div ref={speakerRef} className={`w-full h-full flex justify-center py-2 opacity-0`}>
          <SpeakerIcon className={`inline h-auto`} />
        </div>
      </div>
      <div className={`w-12 h-12 relative`}>
        <PlayButton ref={playRef} play={() => playAudio(AudioUrl)} icon="play" shadow className={`absolute w-full h-full opacity-0`} />
      </div>
      <div className={`w-12 h-12 relative`}>
        <PlayButton ref={playSlowRef} play={() => playAudio(AudioUrl, true)} icon="playSlow" shadow className={`w-full h-full opacity-0`} />
      </div>
    </div>
  );
});
