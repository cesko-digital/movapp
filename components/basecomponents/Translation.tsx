import React from 'react';
import PlayIcon from '../../public/icons/play.svg';
import Marker from 'react-mark.js/Marker';

interface TranslationProps {
  translation: string;
  transcription: string;
  player: HTMLAudioElement | null;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  currentLanguage: 'ua' | 'cz';
  searchText: string;
}

export const Translation = ({
  transcription,
  translation,
  player,
  setPlayer,
  currentLanguage,
  searchText,
}: TranslationProps): JSX.Element => {
  const playerLanguage = currentLanguage === 'cz' ? 'cs' : 'uk';

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
    <div className="flex justify-between items-center py-2 px-5 bg-primary-grey">
      <div className="w-full">
        <p className="translation_text self-start w-full ">
          {/* Marker is used to highlight searched text */}
          <Marker mark={searchText}>{translation}</Marker>
        </p>
        <p className="text-gray-500">{`[ ${transcription} ]`}</p>
      </div>
      <PlayIcon
        onClick={() => handleTranslationAudioPlay(playerLanguage, translation.replace('<strong>', '').replace('</strong>', ''))}
        className="cursor-pointer active:scale-75  stroke-red-500 w-8"
      />
    </div>
  );
};
