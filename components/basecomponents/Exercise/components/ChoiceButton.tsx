import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { playAudio } from '../utils/playAudio';

export interface ChoiceButtonProps extends React.ComponentProps<typeof Button> {
  audioUrl: string;
  correct: boolean;
  buttonsInactive: boolean;
  setButtonsInactive: (val: boolean) => void;
  disableSelect?: boolean;
  playAudioOnClick?: boolean;
  onClick: () => void | Promise<void>;
}

export const ChoiceButton = forwardRef(
  (
    {
      audioUrl,
      correct,
      buttonsInactive,
      setButtonsInactive,
      onClick,
      disableSelect = false,
      playAudioOnClick = false,
      ...rest
    }: ChoiceButtonProps,
    ref: React.Ref<HTMLButtonElement | null>
  ) => {
    const choiceRef = useRef(null);

    useImperativeHandle(ref, () => choiceRef.current);

    return (
      <Button
        ref={choiceRef}
        buttonStyle="choice"
        icon
        onClick={async () => {
          if (buttonsInactive) return;
          if (choiceRef.current === null) return;
          setButtonsInactive(true);
          playAudioOnClick && playAudio(audioUrl);
          await animation.click(choiceRef.current).finished;
          if (disableSelect) {
            setButtonsInactive(false);
            return;
          }
          correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
          await onClick();
          setButtonsInactive(false);
        }}
        {...rest}
      />
    );
  }
);
