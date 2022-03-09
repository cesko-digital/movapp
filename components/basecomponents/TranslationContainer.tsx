import React from 'react';
import PlayIcon from '../../public/icons/play.svg';
import { getHighlightedText } from '../../utils/getHighlightedText';

export interface Translation {
  cz_translation: string;
  ua_translation: string;
  ua_transcription: string;
  cz_transcription: string;
}

interface TranslationContainerProps extends Translation {
  searchText: string;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  player: HTMLAudioElement | null;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const TranslationContainer = ({
  cz_translation,
  ua_translation,
  ua_transcription,
  cz_transcription,
  searchText,
  setPlayer,
  player,
}: TranslationContainerProps): JSX.Element => {
  const uaTranslation = searchText ? getHighlightedText(ua_translation, searchText) : ua_translation;

  const czTranslation = searchText ? getHighlightedText(cz_translation, searchText) : cz_translation;
  const handleTranslationAudioPlay = (language: string, text: string) => {
    // stops player if something is currently playing
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    const source = `https://translate.google.com/translate_tts?tl=${language}&q=${encodeURIComponent(text)}&client=tw-ob`;
    const audio = new Audio(source);

    // setPlayer in order to track if something is playing when next player is triggered
    setPlayer(audio);
    audio.play();
  };

  return (
    <div className="sm:grid sm:grid-cols-[40%_2%_40%] sm:gap-[8%]   sm:items-center my-4 sm:my-2 p-2 border-b-[1px] border-b-slate-200 bg-primary-grey">
      {/* CZ translation  */}
      <div className="flex justify-between items-center py-2 ">
        <div className="w-full">
          <p className="self-start w-full font-semibold">{czTranslation}</p>
          <p className="text-gray-500">{cz_transcription}</p>
        </div>
        <PlayIcon
          onClick={() => handleTranslationAudioPlay('cs', cz_translation)}
          className="cursor-pointer active:scale-75 transition-all duration-300"
        />
      </div>
      {/* Divider */}
      <div className="w-full h-0 sm:h-full justify-self-center sm:w-0 border-1 border-[#D2D2D2]"></div>
      {/* UA translation  */}
      <div className="flex justify-between self-center  py-2 items-center ">
        <div className="w-full pr-4">
          <p className="w-full font-semibold">{uaTranslation}</p>
          <p className="text-gray-500">{ua_transcription}</p>
        </div>
        <PlayIcon onClick={() => handleTranslationAudioPlay('uk', ua_translation)} className="cursor-pointer" />
      </div>
    </div>
  );
};
