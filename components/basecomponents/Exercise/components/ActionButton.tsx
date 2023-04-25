import { useExerciseStore } from '../exerciseStore';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { useTranslation } from 'react-i18next';

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  inactive?: boolean;
  action?: 'nextExercise' | 'home' | 'start';
  onClickAsync?: React.ComponentProps<typeof Button>['onClick'];
}

export const ActionButton = forwardRef(
  ({ children, inactive = false, onClick, onClickAsync, action, ...rest }: ActionButtonProps, ref: React.Ref<HTMLButtonElement | null>) => {
    const btnRef = useRef(null);
    const { t } = useTranslation();
    const home = useExerciseStore((state) => state.home);
    const start = useExerciseStore((state) => state.start);
    const nextExercise = useExerciseStore((state) => state.nextExercise);

    const actions = { nextExercise, home, start };
    const labels = { nextExercise: t('utils.next'), home: t('utils.home'), start: t('utils.play_the_game') };

    useImperativeHandle(ref, () => btnRef.current);

    return (
      <Button
        ref={btnRef}
        buttonStyle="primary"
        onClick={async (e) => {
          if (inactive) return;
          if (btnRef.current === null) return;
          if (onClick !== undefined) onClick(e);
          await animation.click(btnRef.current).finished;
          if (onClickAsync !== undefined) await onClickAsync(e);
          if (action !== undefined) actions[action]();
        }}
        {...rest}
      >
        {action ? labels[action] : children}
      </Button>
    );
  }
);
