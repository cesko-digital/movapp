import { ExerciseStatus } from '../exerciseStore';
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { animation } from '../utils/animation';
import { PlayButton } from './PlayButton';
import { ChoiceComponent } from './ChoiceComponent';
import { ExerciseIdentification } from '../ExerciseIdentification';
import SpeakerIcon from 'public/icons/speaker.svg';
import SoundWaveIcon from 'public/icons/sound-wave.svg';
import OpenBookIcon from 'public/icons/open-book.svg';
import { usePendingStore } from '../ExerciseOrchestrator';

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

export const ExerciseIdentificationComponent = forwardRef(({ exercise }: ExerciseIdentificationComponentProps, ref) => {
  const [buttonsInactive, setButtonsInactive] = useState(false);
  const setPending = usePendingStore((state) => state.setPending);
  const exRef = useRef(null);
  const mainTextRef = useRef(null);
  const soundwaveRef = useRef(null);
  const speakerRef = useRef(null);
  const playRef = useRef(null);
  const playSlowRef = useRef(null);
  const bookRef = useRef(null);
  const status = exercise.status;
  const mode = exercise.mode;

  useImperativeHandle(ref, () => exRef.current);

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

  // clear pending
  useEffect(() => {
    if (status === ExerciseStatus.active) setPending(false);
  }, [setPending, status]);

  // animate elements on Exercise.complete
  useEffect(() => {
    if (status === ExerciseStatus.completed) {
      if (
        mainTextRef === null ||
        mainTextRef.current === null ||
        soundwaveRef === null ||
        soundwaveRef.current === null ||
        bookRef === null ||
        bookRef.current === null ||
        speakerRef === null ||
        speakerRef.current === null ||
        playRef === null ||
        playRef.current === null ||
        playSlowRef === null ||
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

  return (
    <div ref={exRef} className="flex flex-col items-center opacity-0 relative">
      <div className="flex flex-col p-2 items-end absolute text-fuchsia-500 text-xs right-0 -top-10 opacity-50">
        <span className="font-mono">level: {exercise.level}</span>
        <span className="font-mono">mode: {exercise.mode}</span>
        <span className="font-mono">status: {exercise.status}</span>
      </div>
      <div className="relative px-1.5 pt-6 pb-12 mb-6 border border-slate-300 shadow-lg shadow-slate-100 flex flex-col items-center w-full">
        <p className="mb-5 text-sm opacity-60">
          {exercise.mode === 'audio' ? 'Přehrajte zvuk a označte, co slyšíte:' : 'Vyberte jednu správnou odpověď:'}
        </p>
        <div className="flex w-full items-center justify-center">
          <h5 ref={mainTextRef} className={`text-xl text-center p-0 ${mode === 'audio' ? 'opacity-0' : ''}`}>
            {exercise.getText()}
          </h5>
          <div ref={soundwaveRef} className={`absolute w-40 inline ${mode === 'text' ? 'opacity-0' : ''}`}>
            <SoundWaveIcon className="inline h-auto" />
          </div>
        </div>
        {/* <div className={`absolute w-40 inline ${showText ? 'visible' : 'invisible'}`}></div> */}
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
              play={exercise.playAudio}
              icon="play"
              shadow
              className={`absolute w-full h-full ${mode === 'text' ? 'opacity-0' : ''}`}
            />
          </div>
          <div className={`w-12 h-12 relative`}>
            <PlayButton
              ref={playSlowRef}
              play={exercise.playAudioSlow}
              icon="playSlow"
              shadow
              className={`w-full h-full ${mode === 'text' ? 'opacity-0' : ''}`}
            />
          </div>
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
    </div>
  );
});
