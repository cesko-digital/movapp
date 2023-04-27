import { useExerciseStore } from '../exerciseStore';
import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { useTranslation } from 'react-i18next';
import { usePendingStore } from '../ExerciseOrchestrator';

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  inactive?: boolean;
  action?: 'nextExercise' | 'home' | 'start';
  onClickAsync?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => Promise<void> | void;
}

export const ActionButton = forwardRef(
  ({ children, inactive = false, onClick, onClickAsync, action, ...rest }: ActionButtonProps, ref: React.Ref<HTMLButtonElement | null>) => {
    const btnRef = useRef(null);
    const { t } = useTranslation();
    const home = useExerciseStore((state) => state.home);
    const start = useExerciseStore((state) => state.start);
    const nextExercise = useExerciseStore((state) => state.nextExercise);
    const [pending, setPending] = useState(false);
    const mounted = useRef(false);
    const globalPending = usePendingStore((state) => state.pending);
    const actions = { nextExercise, home, start };
    const labels = { nextExercise: t('utils.next'), home: t('utils.home'), start: t('utils.play_the_game') };

    useImperativeHandle(ref, () => btnRef.current);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, [mounted]);

    return (
      <Button
        ref={btnRef}
        buttonStyle="primary"
        onClick={async (e) => {
          if (pending || inactive || globalPending) return;
          if (btnRef.current === null) return;
          //TODO: better naming for click methods
          if (onClick !== undefined) onClick(e);
          setPending(true);
          await animation.click(btnRef.current).finished;
          if (onClickAsync !== undefined) await onClickAsync(e);
          if (action !== undefined) actions[action]();
          // prevent changing unmounted component
          if (mounted.current === false) return;
          setPending(false);
        }}
        {...rest}
      >
        {action ? labels[action] : children}
      </Button>
    );
  }
);
