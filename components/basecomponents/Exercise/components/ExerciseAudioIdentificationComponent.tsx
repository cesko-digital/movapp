import { Choice, ExerciseStatus, resolveMethods, resultMethods, useExerciseStore } from '../exerciseStore';
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { animation } from '../utils/animation';
import SoundWaveIcon from 'public/icons/sound-wave.svg';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import { findById } from '../exerciseStore';
import { AudioControls } from './AudioControls';
import { ChoiceListComponent } from './ChoiceListComponent';
import { ExerciseContainer } from './ExerciseContainer';
import { Hint } from './Hint';
import { MainText } from './MainText';

interface ExerciseAudioIdentificationComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  level: number;
  status: ExerciseStatus;
}

export const ExerciseAudioIdentificationComponent = forwardRef(
  ({ choices, correctChoiceId, status }: ExerciseAudioIdentificationComponentProps, ref) => {
    const exRef = useRef(null);
    const mainTextRef = useRef(null);
    const soundwaveRef = useRef(null);
    const { t } = useTranslation();
    const { otherLanguage } = useLanguage();
    const correctChoice = findById(correctChoiceId, choices);
    const exerciseResolved = useExerciseStore((state) => state.exerciseResolved);
    const exerciseCompleted = useExerciseStore((state) => state.exerciseCompleted);
    const setExerciseResult = useExerciseStore((state) => state.setExerciseResult);

    useImperativeHandle(ref, () => exRef.current);

    // Animation on component mount and unmount
    useEffect(() => {
      const ref = exRef.current;
      if (ref !== null) animation.show(ref);
    }, []);

    // Animate elements on Exercise.complete
    useEffect(() => {
      if (status === ExerciseStatus.completed) {
        if (mainTextRef.current === null || soundwaveRef.current === null) return;

        animation.fade(soundwaveRef.current, 300);
        animation.show(mainTextRef.current, 300, 300);
      }
    }, [status]);

    return (
      <ExerciseContainer ref={exRef}>
        <Hint>{t('exercise_page.exercise_audio_idenfification_hint')}</Hint>
        <div className="flex w-full items-center justify-center">
          <MainText clasName={`opacity-0 ${status === ExerciseStatus.completed ? 'z-10' : ''}`} ref={mainTextRef}>
            {correctChoice.phrase.getTranslation(otherLanguage)}
          </MainText>
          <div ref={soundwaveRef} className={`absolute w-40 inline `}>
            <SoundWaveIcon className="inline h-auto" />
          </div>
        </div>
        <AudioControls AudioUrl={correctChoice.phrase.getSoundUrl(otherLanguage)} playOnMount />
        <ChoiceListComponent
          choices={choices}
          correctChoiceId={correctChoiceId}
          status={status}
          disableSelect={status === ExerciseStatus.completed}
          onChange={async (selectedChoiceIds) => {
            const resolved = resolveMethods.oneCorrect(correctChoiceId, selectedChoiceIds);
            if (resolved) {
              exerciseResolved();
              setExerciseResult(resultMethods.selectedCorrect(correctChoiceId, selectedChoiceIds));
              // await run effects
              exerciseCompleted();
            } else {
              // await run effects
            }
          }}
        />
      </ExerciseContainer>
    );
  }
);
