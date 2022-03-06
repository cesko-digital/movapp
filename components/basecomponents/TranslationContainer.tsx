import React from 'react';
import PlayIcon from '../../public/icons/play.svg';
import { getHighlightedText } from '../../utils/getHighlightedText';

export interface Translation {
  cz: string;
  ua: string;
  ua_transcription: string;
  cz_transcription: string;
  type: string;
}

interface TranslationContainerProps extends Translation {
  searchText: string;
}

export const TranslationContainer = ({
  cz,
  ua,
  ua_transcription,
  cz_transcription,
  searchText,
}: TranslationContainerProps): JSX.Element => {
  const uaTranslation = getHighlightedText(ua, searchText);

  const czTranslation = getHighlightedText(cz, searchText);

  return (
    <div className="grid grid-cols-[40%_40%] gap-[10%] items-center my-2 py-2 border-b-[1px] border-b-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="self-start w-full">{czTranslation}</p>
          <p className="text-gray-500">{cz_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="w-full">{uaTranslation}</p>
          <p className="text-gray-500">{ua_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>
    </div>
  );
};
