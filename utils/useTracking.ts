import { useEffect } from 'react';
import { useLanguage } from './useLanguageHook';
import { usePlausible } from 'next-plausible';
import { useExerciseStore } from 'components/basecomponents/Exercise/exerciseStore';
import { ExerciseStatus } from 'components/basecomponents/Exercise/exerciseStore';

export const useTracking = () => {
  const history = useExerciseStore((state) => state.history);
  const size = useExerciseStore((state) => state.size);
  const status = useExerciseStore((state) => state.status);

  const plausible = usePlausible();
  const lang = useLanguage();

  useEffect(() => {
    if (history.length === size) {
      console.log('Exercise is finished, sending to Plausible');
      const correctAnswers = history.filter((exercise) => {
        return exercise.status === ExerciseStatus.completed && exercise.result?.score === 100;
      });
      const numberOfCorrectAnswers = correctAnswers.length;
      plausible('Exercise-Finished', {
        props: { language: lang.currentLanguage, length: size, correct: numberOfCorrectAnswers },
      });
    } else if (status === 'active' && history.length === 0) {
      console.log('Exercise is started, sending to Plausible');
      plausible('Exercise-Started', { props: { language: lang.currentLanguage, length: size } });
    }
  }, [size, history, status]);
};
