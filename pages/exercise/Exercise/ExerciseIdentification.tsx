import { Button } from 'components/basecomponents/Button';
import { ExerciseIdentification } from './exerciseStore';

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  // exercise: match audio to translated text
  // displays exercise data
  // offers controls

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-3">
        <Button className="bg-primary-blue mr-3" text="PlayAudio" onClick={exercise.playAudio} />
        <Button className="bg-primary-blue" text="PlayAudioSlow" onClick={exercise.playAudioSlow} />
      </div>
      <div className="flex">
        {exercise.choices.map((choice, index) => (
          <Button
            className="bg-primary-blue mr-3"
            ref={choice.setRef}
            key={index}
            text={choice.getText()}
            onClick={choice.select}
            // style={{ color: choice.selected && !choice.correct ? 'gray' : 'black' }}
          />
        ))}
      </div>
    </div>
  );
};
