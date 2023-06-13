import { AudioControls } from './AudioControls';
import { ChoiceButton } from './ChoiceButton';
import CheckIcon from 'public/icons/check.svg';

export interface ChoiceProps {
  type: 'text' | 'audio';
  text: string;
  audioUrl: string;
  className?: string;
  correct: boolean;
  buttonsInactive: boolean;
  setButtonsInactive: (val: boolean) => void;
  disableSelect?: boolean;
  onClick: () => void | Promise<void>;
}

export const ChoiceComponent = ({ type, text, ...rest }: ChoiceProps) => {
  if (type === 'audio')
    return (
      <AudioControls
        AudioUrl={rest.audioUrl}
        renderOptionalButton={() => (
          <ChoiceButton {...rest} className="h-full" playAudioOnClick>
            <CheckIcon className="inline h-auto" />
          </ChoiceButton>
        )}
      />
    );

  if (type === 'text')
    return (
      <ChoiceButton playAudioOnClick {...rest}>
        {text}
      </ChoiceButton>
    );

  return null;
};
