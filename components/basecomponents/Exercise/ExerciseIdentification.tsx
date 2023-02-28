import { Button } from 'components/basecomponents/Button';
import { ExerciseIdentification } from './exerciseStore';
import { useRef } from 'react';
import { animation } from './animation';

/* eslint-disable no-console */

interface ChoiceProps {
  choice: ExerciseIdentification['choices'][0];
}

const Choice = ({ choice }: ChoiceProps) => {
  const choiceRef = useRef(null);
  return (
    <Button
      ref={choiceRef}
      className="bg-primary-blue mr-3"
      text={choice.getText()}
      onClick={async () => {
        if (choiceRef.current === null) return;
        animation.select(choiceRef.current);
        choice.correct ? animation.selectCorrect(choiceRef.current) : animation.selectWrong(choiceRef.current);
        await choice.playAudio(); // wait till audio ended
        choice.select(); // let store know, should be last call in this method
      }}
    />
  );
};

// TODO: extend Button props with play method
interface PlayButtonProps {
  play: () => Promise<void>;
  text: string;
}

const PlayButton = ({ play, text }: PlayButtonProps) => {
  const btnRef = useRef(null);

  return (
    <Button
      className="bg-primary-blue mr-3"
      text={text}
      ref={btnRef}
      onClick={async () => {
        if (btnRef.current === null) return;
        const anim = animation.play(btnRef.current); // infinite loop animation
        await play();
        anim.restart();
        anim.pause();
      }}
    />
  );
};

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  console.log('rerender');

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-3">
        <PlayButton play={exercise.playAudio} text="PlayAudio" />
        <PlayButton play={exercise.playAudioSlow} text="PlayAudioSlow" />
      </div>
      <div className="flex">
        {exercise.choices.map((choice) => (
          <Choice key={choice.id} choice={choice} />
        ))}
      </div>
    </div>
  );
};
