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
    <div className="sm:grid sm:grid-cols-[40%_2%_40%] sm:gap-[8%] sm:items-center my-4 sm:my-2 p-2 border-b-[1px] border-b-slate-200 bg-primary-grey">
      {/* CZ translation  */}
      <div className="flex justify-between items-center py-2 ">
        <div>
          <p className="self-start w-full font-semibold">{czTranslation}</p>
          <p className="text-gray-500">{cz_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>
      {/* Divider */}
      <div className="w-full h-0 sm:h-full sm:w-0 border-1 border-[#D2D2D2]"></div>
      {/* UA translation  */}
      <div className="flex justify-between py-2 items-center ">
        <div>
          <p className="w-full font-semibold">{uaTranslation}</p>
          <p className="text-gray-500">{ua_transcription}</p>
        </div>
        <PlayIcon className="cursor-pointer" />
      </div>
    </div>
  );
};
