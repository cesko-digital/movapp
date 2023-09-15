import { Choice, ExerciseStatus, useExerciseStore } from '../exerciseStore';
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { animation } from '../utils/animation';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import { findById } from '../exerciseStore';
import { ChoiceListComponent } from './ChoiceListComponent';
import { ExerciseContainer } from './ExerciseContainer';
import { resolveMethods } from '../utils/resolveMethods';
import { resultMethods } from '../utils/resultMethods';
import { TextIdentificationHeader } from './TextIdentificationHeader';
import { AudioControls } from './AudioControls';

interface ExerciseTextIdentificationComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  level: number;
  status: ExerciseStatus;
  mainTextLanguage: 'other' | 'current';
  choiceTextLanguage: 'other' | 'current';
  choiceAudioLanguage: 'other' | 'current';
  choiceType: 'audio' | 'text';
}

export const ExerciseTextIdentificationComponent = forwardRef(
  (
    {
      choices,
      correctChoiceId,
      status,
      mainTextLanguage,
      choiceTextLanguage,
      choiceAudioLanguage,
      choiceType,
    }: ExerciseTextIdentificationComponentProps,
    ref
  ) => {
    const exRef = useRef(null);
    const { t } = useTranslation();
    const { currentLanguage, otherLanguage } = useLanguage();
    const correctChoice = findById(correctChoiceId, choices);
    const exerciseCompleted = useExerciseStore((state) => state.exerciseCompleted);

    useImperativeHandle(ref, () => exRef.current);

    // Animation on component mount and unmount
    useEffect(() => {
      const ref = exRef.current;
      if (ref !== null) animation.show(ref);
    }, []);

    return (
      <ExerciseContainer ref={exRef}>
        <TextIdentificationHeader
          mainText={correctChoice.phrase.getTranslation(mainTextLanguage === 'current' ? currentLanguage : otherLanguage)}
          hint={t('exercise_page.exercise_text_idenfification_hint')}
          status={status}
        />
        {status === ExerciseStatus.completed && (
          <AudioControls className="mt-5 mb-5" AudioUrl={correctChoice.phrase.getSoundUrl(otherLanguage)} />
        )}
        <ChoiceListComponent
          choiceType={choiceType}
          textLanguage={choiceTextLanguage}
          audioLanguage={choiceAudioLanguage}
          choices={choices}
          correctChoiceId={correctChoiceId}
          status={status}
          disableSelect={status === ExerciseStatus.completed}
          onChange={async (selectedChoiceIds) => {
            const resolved = resolveMethods.oneCorrect(correctChoiceId, selectedChoiceIds);
            if (resolved) {
              const result = resultMethods.selectedCorrect(correctChoiceId, selectedChoiceIds);
              // await run effects
              exerciseCompleted(result);
            } else {
              // await run effects
            }
          }}
        />
      </ExerciseContainer>
    );
  }
);
