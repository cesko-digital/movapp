import { Trans } from 'next-i18next';
import React from 'react';
import PlayIcon from '../../public/icons/play.svg';

interface TranslationProps {
  translation: string;
  transcription: string;
  player: HTMLAudioElement | null;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
}

export const Translation = ({ transcription, translation, player, setPlayer }: TranslationProps): JSX.Element => {
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
          <Trans>{translation}</Trans>
        </p>
        <p className="text-gray-500">{`[ ${transcription} ]`}</p>
      </div>
      <PlayIcon
        onClick={() => handleTranslationAudioPlay('cs', translation)}
        className="cursor-pointer active:scale-75 transition-all duration-300"
      />
    </div>
  );
};
