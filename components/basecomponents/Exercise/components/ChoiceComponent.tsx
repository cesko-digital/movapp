import { useRef } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { playAudio } from '../utils/playAudio';

interface ChoiceProps {
  text: string;
  audioUrl: string;
  className?: string;
  correct: boolean;
  buttonsInactive: boolean;
  setButtonsInactive: (val: boolean) => void;
  playAudioOnly?: boolean;
  onClick: () => void;
}

export const ChoiceComponent = ({
  text,
  audioUrl,
  correct,
  className = '',
  buttonsInactive,
  setButtonsInactive,
  onClick,
  playAudioOnly = false,
}: ChoiceProps) => {
  const choiceRef = useRef(null);

  return (
    <Button
      ref={choiceRef}
      buttonStyle="choice"
      className={`${className}`}
      onClick={async () => {
        if (buttonsInactive) return;
        if (choiceRef.current === null) return;
        setButtonsInactive(true);
        playAudio(audioUrl);
        await animation.click(choiceRef.current).finished;
        if (playAudioOnly) {
          setButtonsInactive(false);
          return;
        }
        correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
        onClick();
        setButtonsInactive(false);
      }}
    >
      {text}
    </Button>
  );
};
