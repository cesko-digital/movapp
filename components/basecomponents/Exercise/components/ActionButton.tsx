import { useExerciseStore } from '../exerciseStore';
import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import { useTranslation } from 'react-i18next';
import { usePendingStore } from '../pendingStore';
import { usePlausible } from 'next-plausible';
import React from 'react';
import { getCountryVariant } from 'utils/locales';

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  inactive?: boolean;
  action?: 'nextExercise' | 'home' | 'start';
  onClickAsync?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => Promise<void> | void;
  onClickFinished?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => Promise<void> | void;
  exerciseLength?: number;
  isPlausible?: boolean;
}

export const ActionButton = forwardRef(
  (
    { children, inactive = false, onClick, onClickAsync, onClickFinished, action, exerciseLength, isPlausible, ...rest }: ActionButtonProps,
    ref: React.Ref<HTMLButtonElement | null>
  ) => {
    const plausible = usePlausible();
    const btnRef = useRef(null);
    const { t } = useTranslation();
    const home = useExerciseStore((state) => state.home);
    const start = useExerciseStore((state) => state.start);
    const nextExercise = useExerciseStore((state) => state.nextExercise);
    const [pending, setPending] = useState(false);
    const mounted = useRef(false);
    const globalPending = usePendingStore((state) => state.pending);
    const setGlobalPending = usePendingStore((state) => state.setPending);
    const actions = { nextExercise, home, start };
    const labels = { nextExercise: t('exercise_page.next'), home: t('exercise_page.home'), start: t('exercise_page.play_the_game') };

    useImperativeHandle(ref, () => btnRef.current);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, [mounted]);

    useEffect(() => {
      return () => {
        setGlobalPending(false);
      };
    }, [setGlobalPending]);

    return (
      <Button
        ref={btnRef}
        buttonStyle="primary"
        onClick={async (e) => {
          isPlausible && plausible('Exercise-Started', { props: { language: getCountryVariant(), length: exerciseLength } });
          if (pending || inactive || globalPending) return;
          if (btnRef.current === null) return;
          setPending(true);
          setGlobalPending(true);
          if (onClick !== undefined) onClick(e);
          await animation.click(btnRef.current).finished;
          if (onClickAsync !== undefined) await onClickAsync(e);
          if (action === 'nextExercise') actions['nextExercise'](plausible);
          else if (action !== undefined) actions[action]();
          // prevent changing unmounted component
          if (mounted.current === false) return;
          setGlobalPending(false);
          setPending(false);
          if (onClickFinished !== undefined) onClickFinished(e);
        }}
        {...rest}
      >
        {React.Children.count(children) ? children : action ? labels[action] : children}
      </Button>
    );
  }
);
