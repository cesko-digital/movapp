import React from 'react';
import { ExampleType } from '../../data/alphabet';
import PlayIcon from '../../public/icons/play.svg';

// <div className="h-full border-1"></div>

interface AlphabetCardProps {
  mainLanguageLetter: string[];
  secondaryLanguageLetterTranscription: string[];
  examples: ExampleType[];
  player: HTMLAudioElement | null;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
}

export const AlphabetCard = ({
  mainLanguageLetter,
  secondaryLanguageLetterTranscription,
  examples,
  player,
  setPlayer,
}: AlphabetCardProps): JSX.Element => {
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
    <div className=" grid grid-rows-[66%_34%] group sm:hover:shadow-lg">
      <div className="bg-white rounded-t-lg group-hover:bg-primary-blue transition-colors duration-500">
        <div className="grid grid-cols-[50%_50%] grid-flow-col py-4">
          <p className="font-sans font-light px-4 group-hover:text-white transition-colors duration-500">Česky</p>
          <p className="font-sans font-light px-4 group-hover:text-white transition-colors duration-500">Укр</p>
        </div>
        <div className="grid grid-cols-[50%_1px_50%] grid-flow-col ">
          <div className="px-4 ">
            <span className="text-6xl md:text-7xl font-light group-hover:text-white transition-colors duration-500">
              {mainLanguageLetter[0]}
            </span>
            <span className="text-5xl md:text-6xl font-light group-hover:text-white transition-colors duration-500">
              {mainLanguageLetter[1]}
            </span>
            <div className="flex justify-between py-5 items-center">
              <PlayIcon
                onClick={() => handleTranslationAudioPlay('cs', mainLanguageLetter[1])}
                className="w-8 md:w-12 stroke-red-500 cursor-pointer"
              />
              <span className="pr-4 text-[20px]  text-[#676767]  font-sans-pro group-hover:text-white transition-colors duration-500">
                [{mainLanguageLetter[1]}]
              </span>
            </div>
          </div>
          <div className="h-full border-1"></div>
          <div className="px-4">
            <span className="text-6xl md:text-7xl font-light group-hover:text-white transition-colors duration-500">
              {secondaryLanguageLetterTranscription[0]}
            </span>
            <span className="text-5xl md:text-6xl font-light group-hover:text-white transition-colors duration-500">
              {secondaryLanguageLetterTranscription[1]}
            </span>
            <div className="flex justify-between py-5 items-center">
              <PlayIcon
                onClick={() => handleTranslationAudioPlay('uk', secondaryLanguageLetterTranscription[1])}
                className="w-8 md:w-12 stroke-red-500 cursor-pointer"
              />
              <span className="pr-4 text-[20px] text-[#676767] group-hover:text-white transition-colors duration-500  text-sans">
                [{secondaryLanguageLetterTranscription[1]}]
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-yellow py-3 rounded-b-lg">
        <div className="grid grid-cols-[50%_50%] grid-flow-col">
          <p className="font-sans px-4">Příklady</p>
          <p className="font-sans px-4">Приклади</p>
        </div>
        {examples.map(({ example, translation }, index) => {
          return (
            <div key={index} className="grid grid-cols-[50%_50%] grid-flow-col">
              <div className="flex items-center px-4">
                <p className="font-light break-all text-xs md:text-sm">{example}</p>
                <PlayIcon
                  onClick={() => handleTranslationAudioPlay('cs', example)}
                  className="w-3 md:w-5 stroke-red-500 ml-1 cursor-pointer"
                />
              </div>
              <div className="flex items-center px-4">
                <p className="font-light text-xs md:text-sm">{translation}</p>
                <PlayIcon
                  onClick={() => handleTranslationAudioPlay('uk', translation)}
                  className="w-3 md:w-5 stroke-red-500 ml-1 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
