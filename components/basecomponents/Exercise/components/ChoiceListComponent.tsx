import { useLanguage } from 'utils/useLanguageHook';
import { Choice, ExerciseStatus } from '../exerciseStore';
import { useState } from 'react';
import { ChoiceComponent } from './ChoiceComponent';

interface ChoiceListComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  status: ExerciseStatus;
  onChange: (selectedChoiceIds: number[]) => void | Promise<void>;
  disableSelect?: boolean;
  textLanguage: 'current' | 'other';
  audioLanguage: 'current' | 'other';
}

export const ChoiceListComponent = ({
  choices,
  correctChoiceId,
  onChange,
  disableSelect = false,
  textLanguage,
  audioLanguage,
}: ChoiceListComponentProps) => {
  const [buttonsInactive, setButtonsInactive] = useState(false);
  const { currentLanguage, otherLanguage } = useLanguage();
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch justify-items-stretch gap-3">
      {choices.map(({ id, phrase }) => (
        <ChoiceComponent
          key={id}
          text={phrase.getTranslation(textLanguage === 'current' ? currentLanguage : otherLanguage)}
          audioUrl={phrase.getSoundUrl(audioLanguage === 'current' ? currentLanguage : otherLanguage)}
          className="text-sm sm:text-base"
          correct={id === correctChoiceId}
          buttonsInactive={buttonsInactive}
          setButtonsInactive={setButtonsInactive}
          disableSelect={disableSelect}
          onClick={async () => {
            if (selectedChoiceIds.includes(id)) {
              return;
            }
            const updatedSelectedIds = [...selectedChoiceIds, id];
            setSelectedChoiceIds(updatedSelectedIds);
            await onChange(updatedSelectedIds);
          }}
        />
      ))}
    </div>
  );
};
