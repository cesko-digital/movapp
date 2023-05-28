import { Exercise, ExerciseType } from '../exerciseStore';
import { forwardRef } from 'react';
import { ExerciseAudioIdentificationComponent } from './ExerciseAudioIdentificationComponent';
import { ExerciseTextIdentificationComponent } from './ExerciseTextIdentificationComponent';

interface ExerciseComponentLoaderProps {
  exercise: Exercise;
}

export const ExerciseComponentLoader = forwardRef(({ exercise }: ExerciseComponentLoaderProps, ref) => {
  switch (exercise.type) {
    case ExerciseType.audioIdentification:
      return (
        <ExerciseAudioIdentificationComponent
          ref={ref}
          key={exercise.id}
          level={exercise.level}
          choices={exercise.choices}
          correctChoiceId={exercise.correctChoiceId}
          status={exercise.status}
        />
      );
    case ExerciseType.textIdentification:
      return (
        <ExerciseTextIdentificationComponent
          ref={ref}
          key={exercise.id}
          level={exercise.level}
          choices={exercise.choices}
          correctChoiceId={exercise.correctChoiceId}
          status={exercise.status}
        />
      );
    default:
      return <p>something went wrong...</p>;
  }
});
