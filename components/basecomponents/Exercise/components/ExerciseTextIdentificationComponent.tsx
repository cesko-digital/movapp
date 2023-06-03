import { Choice, ExerciseStatus, useExerciseStore } from '../exerciseStore';
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { animation } from '../utils/animation';
import OpenBookIcon from 'public/icons/open-book.svg';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import { findById } from '../exerciseStore';
import { ChoiceListComponent } from './ChoiceListComponent';
import { ExerciseContainer } from './ExerciseContainer';
import { Hint } from './Hint';
import { MainText } from './MainText';
import { resolveMethods } from '../utils/resolveMethods';
import { resultMethods } from '../utils/resultMethods';

interface ExerciseIdentificationComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  level: number;
  status: ExerciseStatus;
  inverse?: boolean;
}

export const ExerciseTextIdentificationComponent = forwardRef(
  ({ choices, correctChoiceId, status, inverse = false }: ExerciseIdentificationComponentProps, ref) => {
    const exRef = useRef(null);
    const mainTextRef = useRef(null);
    const soundwaveRef = useRef(null);
    const speakerRef = useRef(null);
    const playRef = useRef(null);
    const playSlowRef = useRef(null);
    const bookRef = useRef(null);
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

    // Animate elements on Exercise.complete
    useEffect(() => {
      if (status === ExerciseStatus.completed) {
        if (
          mainTextRef.current === null ||
          soundwaveRef.current === null ||
          bookRef.current === null ||
          speakerRef.current === null ||
          playRef.current === null ||
          playSlowRef.current === null
        )
          return;

        animation.fade(soundwaveRef.current, 300);
        animation.fade(bookRef.current, 300);
        animation.show(speakerRef.current, 300, 300);
        animation.show(playRef.current, 300, 350);
        animation.show(playSlowRef.current, 300, 400);
      }
    }, [status]);

    return (
      <ExerciseContainer ref={exRef}>
        <Hint>{t('exercise_page.exercise_text_idenfification_hint')}</Hint>
        <div className="flex w-full items-center justify-center">
          <MainText ref={mainTextRef}>{correctChoice.phrase.getTranslation(inverse ? currentLanguage : otherLanguage)}</MainText>
        </div>
        <div ref={bookRef} className={`w-12 h-12 flex justify-center mb-5 mt-5`}>
          <OpenBookIcon className={`inline h-auto`} />
        </div>
        <ChoiceListComponent
          textLanguage={inverse ? 'other' : 'current'}
          audioLanguage="other"
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
