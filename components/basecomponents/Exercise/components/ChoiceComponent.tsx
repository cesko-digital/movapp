import { useRef } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';

interface ChoiceProps {
  text: string;
  className?: string;
  correct: boolean;
  inactive?: boolean;
  onClickStarted: () => void;
  onClickFinished: () => void;
}

export const ChoiceComponent = ({ text, correct, className = '', inactive = false, onClickStarted, onClickFinished }: ChoiceProps) => {
  const choiceRef = useRef(null);

  return (
    <Button
      ref={choiceRef}
      buttonStyle="choice"
      className={`${className}`}
      onClick={async () => {
        if (inactive) return;
        if (choiceRef.current === null) return;
        onClickStarted();
        await animation.click(choiceRef.current).finished;
        correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
        onClickFinished();
      }}
    >
      {text}
    </Button>
  );
};
