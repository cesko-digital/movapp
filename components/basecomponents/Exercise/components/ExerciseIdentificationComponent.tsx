import { ExerciseStatus } from '../exerciseStore';
import React, { useRef, useState, useEffect } from 'react';
import { animation } from '../utils/animation';
import { PlayButton } from './PlayButton';
import { ChoiceComponent } from './ChoiceComponent';
import { ActionButton } from './ActionButton';
import { ExerciseIdentification } from '../ExerciseIdentification';
import SpeakerIcon from 'public/icons/speaker.svg';
import SoundWaveIcon from 'public/icons/sound-wave.svg';

/**
 * Exercise component is UI for exercise object
 * It handles user intereactions. It inactivates certain controls at certain situations.
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
  exercise: ExerciseIdentification;
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  const [buttonsInactive, setButtonsInactive] = useState(false);
  const [pending, setPending] = useState(false);
  const exRef = useRef(null);

  // Animation on component mount and unmount
  useEffect(() => {
    const ref = exRef.current;
    if (ref !== null) animation.show(ref);
    if (exercise.mode === 'audio') exercise.playAudio();
    return () => {
      if (ref !== null) animation.fade(ref);
    };
    /* adding exercise to deps causes to run useEffect on every change of exercise,
     one workaround would be import exercise from store directly and remove it from props */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAudio = exercise.mode === 'audio' || exercise.status === ExerciseStatus.completed;
  const showText = exercise.mode === 'text' || exercise.status === ExerciseStatus.completed;

  return (
    <div ref={exRef} className="flex flex-col items-center opacity-0 relative">
      <div className="flex flex-col p-2 items-end absolute text-fuchsia-500 text-xs right-0 -top-10 opacity-50">
        <span className="font-mono">Test data</span>
        <span className="font-mono">Level: {exercise.level}</span>
      </div>
      <div className="relative px-1.5 pt-6 pb-12 mb-6 border border-slate-300 shadow-lg shadow-slate-100 flex flex-col items-center w-full">
        <p className="mb-5 text-sm opacity-60">
          {exercise.mode === 'audio' ? 'Přehrajte zvuk a označte, co slyšíte:' : 'Vyberte jednu správnou odpověď:'}
        </p>
        <div className="flex w-full items-center justify-center">
          <h5 className={`text-xl text-center p-0 ${showText ? 'visible' : 'invisible'}`}>{exercise.getText()}</h5>
          <div className={`absolute w-40 inline ${!showText ? 'visible' : 'invisible'}`}>
            <SoundWaveIcon className="inline h-auto" />
          </div>
        </div>
        <div
          className={`grid grid-cols-3 items-stretch justify-items-stretch  gap-x-3 mb-5 mt-5 ${
            showAudio ? 'opacity-100' : 'grayscale opacity-50'
          }`}
        >
          <div className="flex items-center justify-center w-12 p-1.5">
            <SpeakerIcon className="inline h-auto" />
          </div>
          <PlayButton play={exercise.playAudio} icon="play" shadow disabled={!showAudio} />
          <PlayButton play={exercise.playAudioSlow} icon="playSlow" shadow disabled={!showAudio} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch justify-items-stretch gap-3">
          {exercise.choices.map((choice) => (
            <ChoiceComponent
              key={choice.id}
              text={choice.getText()}
              className="text-sm"
              correct={choice.correct}
              inactive={buttonsInactive}
              onClickStarted={() => {
                setButtonsInactive(true);
                choice.playAudio(); // await ommited cause resolving of playAudio has significant delay
              }}
              onClickFinished={async () => {
                choice.select();
                const resolved = exercise.resolve();
                if (resolved) {
                  // run effects
                  exercise.completed();
                } else {
                  // run effects
                  setButtonsInactive(false);
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <ActionButton action="home" inactive={pending} onClick={() => setPending(true)} />
        <ActionButton
          action="nextExercise"
          inactive={pending}
          className={exercise.status === ExerciseStatus.completed ? 'visible' : 'invisible'}
          onClick={() => setPending(true)}
          onClickAsync={async () => {
            if (exRef.current === null) return;
            await animation.fade(exRef.current, 300, 500).finished;
          }}
        />
      </div>
    </div>
  );
};
