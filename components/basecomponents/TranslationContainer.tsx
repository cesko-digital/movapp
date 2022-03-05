import React from 'react';
import ReverseIcon from '../../public/icons/reverse.svg';
import PlayIcon from '../../public/icons/play.svg';

export interface Translation {
  cz: string;
  ua: string;
  ua_transcription: string;
  cz_transcription: string;
  type: string;
}

export const TranslationContainer = ({
  cz,
  ua,
  ua_transcription,
  cz_transcription,
}: Translation): JSX.Element => {
  return (
    <div className="grid grid-cols-[40%_40%] gap-[10%] items-center my-2 py-2 border-b-[1px] border-b-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="self-start w-full">{cz}</p>
          <p className="text-gray-500">{cz_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="w-full">{ua}</p>
          <p className="text-gray-500">{ua_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>
    </div>
  );
};
