import { useLanguage } from 'utils/useLanguageHook';
import { Choice, ExerciseStatus, resolveMethods, resultMethods, useExerciseStore } from '../exerciseStore';
import { useState } from 'react';
import { ChoiceComponent } from './ChoiceComponent';

interface ChoiceListComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  status: ExerciseStatus;
}

export const ChoiceListComponent = ({ choices, correctChoiceId, status }: ChoiceListComponentProps) => {
  const [buttonsInactive, setButtonsInactive] = useState(false);
  const exerciseResolved = useExerciseStore((state) => state.exerciseResolved);
  const exerciseCompleted = useExerciseStore((state) => state.exerciseCompleted);
  const setExerciseResult = useExerciseStore((state) => state.setExerciseResult);
  const { currentLanguage, otherLanguage } = useLanguage();
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch justify-items-stretch gap-3">
      {choices.map(({ id, phrase }) => (
        <ChoiceComponent
          key={id}
          text={phrase.getTranslation(currentLanguage)}
          audioUrl={phrase.getSoundUrl(otherLanguage)}
          className="text-sm sm:text-base"
          correct={id === correctChoiceId}
          buttonsInactive={buttonsInactive}
          setButtonsInactive={setButtonsInactive}
          playAudioOnly={status === ExerciseStatus.completed}
          onClick={async () => {
            if (selectedChoiceIds.includes(id)) {
              return;
            }
            const updatedSelectedIds = [...selectedChoiceIds, id];
            setSelectedChoiceIds(updatedSelectedIds);
            const resolved = resolveMethods.oneCorrect(correctChoiceId, updatedSelectedIds);
            if (resolved) {
              exerciseResolved();
              setExerciseResult(resultMethods.selectedCorrect(correctChoiceId, updatedSelectedIds));
              // await run effects
              exerciseCompleted();
            } else {
              // await run effects
            }
          }}
        />
      ))}
    </div>
  );
};
