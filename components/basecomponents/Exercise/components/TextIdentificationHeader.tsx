import { ExerciseStatus } from '../exerciseStore';
import React from 'react';
import OpenBookIcon from 'public/icons/open-book.svg';

import { Hint } from './Hint';
import { MainText } from './MainText';

interface TextIdentificationHeaderProps {
  mainText: string;
  hint: string;
  status: ExerciseStatus;
}

export const TextIdentificationHeader = ({ mainText, hint, status }: TextIdentificationHeaderProps) => {
  return (
    <>
      <Hint>{hint}</Hint>
      <div className="flex w-full items-center justify-center">
        <MainText>{mainText}</MainText>
      </div>
      {status === ExerciseStatus.active && (
        <div className={`w-12 h-12 flex justify-center mb-5 mt-5`}>
          <OpenBookIcon className={`inline h-auto`} />
        </div>
      )}
    </>
  );
};
