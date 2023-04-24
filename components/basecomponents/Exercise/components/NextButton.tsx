import { Exercise } from '../exerciseStore';
import { useRef } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { useTranslation } from 'react-i18next';

interface NextButtonProps {
  onClick: Exercise['next'];
}

export const NextButton = ({ onClick }: NextButtonProps) => {
  const btnRef = useRef(null);
  const { t } = useTranslation();

  return (
    <div className="flex mb-3">
      <Button
        buttonStyle="primary"
        ref={btnRef}
        onClick={async () => {
          if (btnRef.current === null) return;
          await animation.select(btnRef.current).finished;
          onClick();
        }}
      >
        {t('utils.next') || ''}
      </Button>
    </div>
  );
};