import { Exercise } from '../exerciseStore';
import { useRef } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';

interface NextButtonProps {
  onClick: Exercise['next'];
}

export const NextButton = ({ onClick }: NextButtonProps) => {
  const btnRef = useRef(null);
  return (
    <div className="flex mb-3">
      <Button
        ref={btnRef}
        className="bg-primary-blue mr-3"
        text="next" // TODO: replace text with arrow icon
        onClick={async () => {
          if (btnRef.current === null) return;
          await animation.select(btnRef.current).finished;
          onClick();
        }}
      />
    </div>
  );
};
