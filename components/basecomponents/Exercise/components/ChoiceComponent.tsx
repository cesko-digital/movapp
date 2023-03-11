import { useRef } from "react";
import { Button } from "components/basecomponents/Button";
import { animation } from "../utils/animation";

interface ChoiceProps {
    text: string;
    correct: boolean;
    inactive?: boolean;
    onClickStarted: () => void;
    onClickFinished: () => void;
  }
  
export const ChoiceComponent = ({ text, correct, inactive = false, onClickStarted, onClickFinished }: ChoiceProps) => {
    const choiceRef = useRef(null);
  
    return (
      <Button
        ref={choiceRef}
        className="bg-primary-blue mr-3"
        text={text}
        onClick={async () => {
          if (inactive) return;
          if (choiceRef.current === null) return;
          onClickStarted();
          await animation.select(choiceRef.current).finished;
          correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
          onClickFinished();
        }}
      />
    );
  };
  