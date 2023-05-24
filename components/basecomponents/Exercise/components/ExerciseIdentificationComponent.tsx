import { Choice, ExerciseStatus } from '../exerciseStore';
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { animation } from '../utils/animation';
import { PlayButton } from './PlayButton';
import { ChoiceComponent } from './ChoiceComponent';
import SpeakerIcon from 'public/icons/speaker.svg';
import SoundWaveIcon from 'public/icons/sound-wave.svg';
import OpenBookIcon from 'public/icons/open-book.svg';
import { useTranslation } from 'react-i18next';
import { useDebug } from '../utils/useDebug';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useLanguage } from 'utils/useLanguageHook';
import { useExerciseStore, resultMethods, resolveMethods, findById } from '../exerciseStore';

const playAudio = (url: string, slow = false) => AudioPlayer.getInstance().playSrc(url, slow ? 0.75 : 1);

/**
 * Exercise component is UI for exercise object
 * It handles user interactions. It inactivates certain controls at certain situations.
 * It has set of prepared actions.
 * It is responsible for taking valid actions only.
 *
 * Inactive controls ensures correct operation.
 * Disabled controls inform user.
 *
 * Operation of this Exercise:
 * 1. Exercise appears and sound is played !!! IOS autoplay problem
 * 2. User clicks on choice. It is set as selected. Then it try to resolve exercise.
 * 2a. If resolved: Result prop is set and exercise status is changed to resolved.
 * 2b. If not resolved: It is waiting for user to select another choice.
 * 3. Then it's status is changed to complete.
 * 4. Button NEXT appears.
 */

interface ExerciseIdentificationComponentProps {
  choices: Choice[];
  correctChoiceId: number;
  level: number;
  mode: 'audio' | 'text';
}

export const ExerciseIdentificationComponent = forwardRef(
  ({ choices, correctChoiceId, level, mode }: ExerciseIdentificationComponentProps, ref) => {
    const [buttonsInactive, setButtonsInactive] = useState(false);
    const exerciseResolved = useExerciseStore((state) => state.exerciseResolved);
    const exerciseCompleted = useExerciseStore((state) => state.exerciseCompleted);
    const setExerciseResult = useExerciseStore((state) => state.setExerciseResult);
    const exRef = useRef(null);
    const mainTextRef = useRef(null);
    const soundwaveRef = useRef(null);
    const speakerRef = useRef(null);
    const playRef = useRef(null);
    const playSlowRef = useRef(null);
    const bookRef = useRef(null);
    const { t } = useTranslation();
    const { currentLanguage, otherLanguage } = useLanguage();
    const debug = useDebug();
    const [status, setStatus] = useState(ExerciseStatus.active);
    const correctChoice = findById(correctChoiceId, choices);
    const playCorrectPhraseAudio = useCallback(
      (slow = false) => playAudio(correctChoice.phrase.getSoundUrl(otherLanguage), slow),
      [otherLanguage, correctChoice]
    );
    const playCorrectPhraseAudioSlow = () => playCorrectPhraseAudio(true);
    const [selectedChoiceIds, setSelectedChoiceIds] = useState<number[]>([]);

    useImperativeHandle(ref, () => exRef.current);

    // Animation on component mount and unmount
    useEffect(() => {
      const ref = exRef.current;
      if (ref !== null) animation.show(ref);
      return () => {
        if (ref !== null) animation.fade(ref);
      };
    }, [mode]);

    // Play audio on component mount and language change
    useEffect(() => {
      if (mode === 'audio') playCorrectPhraseAudio();
    }, [mode, playCorrectPhraseAudio]);

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
        mode === 'audio'
          ? (animation.fade(soundwaveRef.current, 300), animation.show(mainTextRef.current, 300, 300))
          : (animation.fade(soundwaveRef.current, 300),
            animation.fade(bookRef.current, 300),
            animation.show(speakerRef.current, 300, 300),
            animation.show(playRef.current, 300, 350),
            animation.show(playSlowRef.current, 300, 400));
      }
    }, [status, mode]);

    const audioButtonsEnabled = (mode === 'text' && status === ExerciseStatus.completed) || mode === 'audio';

    return (
      <div ref={exRef} className="flex flex-col items-center opacity-0 relative">
        {debug && (
          <div className="flex flex-col p-2 items-end absolute text-fuchsia-500 text-xs right-0 -top-10 opacity-50">
            <span className="font-mono">level: {level}</span>
            <span className="font-mono">mode: {mode}</span>
            <span className="font-mono">status: {status}</span>
          </div>
        )}
        <div className="relative px-1.5 pt-6 pb-12 mb-6 border border-slate-300 shadow-lg shadow-slate-100 flex flex-col items-center w-full">
          <p className="mb-5 text-sm sm:text-base opacity-60">
            {mode === 'audio'
              ? t('exercise_page.exercise_audio_idenfification_hint')
              : t('exercise_page.exercise_text_idenfification_hint')}
          </p>
          <div className="flex w-full items-center justify-center">
            <h5 ref={mainTextRef} className={`text-xl sm:text-2xl text-center p-0 ${mode === 'audio' ? 'opacity-0' : ''}`}>
              {correctChoice.phrase.getTranslation(otherLanguage)}
            </h5>
            <div ref={soundwaveRef} className={`absolute w-40 inline ${mode === 'text' ? 'opacity-0' : ''}`}>
              <SoundWaveIcon className="inline h-auto" />
            </div>
          </div>
          <div className={`grid grid-cols-3 gap-x-3 mb-5 mt-5`}>
            <div className={`w-12 h-12 relative`}>
              <div ref={speakerRef} className={`w-full h-full flex justify-center py-2 ${mode === 'text' ? 'opacity-0' : ''}`}>
                <SpeakerIcon className={`inline h-auto`} />
              </div>
            </div>
            <div className={`w-12 h-12 relative`}>
              <div ref={bookRef} className={`absolute w-full h-full flex justify-center ${mode === 'audio' ? 'opacity-0' : ''}`}>
                <OpenBookIcon className={`inline h-auto`} />
              </div>
              <PlayButton
                ref={playRef}
                play={playCorrectPhraseAudio}
                icon="play"
                shadow
                className={`absolute w-full h-full ${mode === 'text' ? 'opacity-0' : ''} ${audioButtonsEnabled ? 'visible' : 'invisible'}`}
              />
            </div>
            <div className={`w-12 h-12 relative`}>
              <PlayButton
                ref={playSlowRef}
                play={playCorrectPhraseAudioSlow}
                icon="playSlow"
                shadow
                className={`w-full h-full ${mode === 'text' ? 'opacity-0' : ''} ${audioButtonsEnabled ? 'visible' : 'invisible'}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch justify-items-stretch gap-3">
            {choices.map(({ id, phrase }) => (
              <ChoiceComponent
                key={id}
                text={phrase.getTranslation(currentLanguage)}
                className="text-sm sm:text-base"
                correct={id === correctChoiceId}
                inactive={buttonsInactive}
                onClickStarted={() => {
                  setButtonsInactive(true);
                  playAudio(phrase.getSoundUrl(otherLanguage)); // await ommited cause resolving of playAudio has significant delay
                }}
                onClickFinished={async () => {
                  if (selectedChoiceIds.includes(id)) {
                    setButtonsInactive(false);
                    return;
                  }
                  const updatedSelectedIds = [...selectedChoiceIds, id];
                  setSelectedChoiceIds(updatedSelectedIds);
                  const resolved = resolveMethods.oneCorrect(correctChoiceId, updatedSelectedIds);
                  if (resolved) {
                    setStatus(ExerciseStatus.resolved);
                    exerciseResolved();
                    setExerciseResult(resultMethods.selectedCorrect(correctChoiceId, updatedSelectedIds));
                    // await run effects
                    setStatus(ExerciseStatus.completed);
                    exerciseCompleted();
                  } else {
                    // await run effects
                    setButtonsInactive(false);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);
