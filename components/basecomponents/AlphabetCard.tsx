import React from 'react';
import { ExampleType } from '../../data/alphabet';
import PlayIcon from '../../public/icons/play.svg';

interface AlphabetCardProps {
  examples: ExampleType[];
  player: HTMLAudioElement | null;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  czLetter: [string, string | null];
  uaTranscription: string;
}

export const AlphabetCard = ({ examples, player, setPlayer, czLetter, uaTranscription }: AlphabetCardProps): JSX.Element => {
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
    <div role="button" tabIndex={0} className=" grid grid-rows-[66%_34%] shadow-lg group sm:hover:shadow-lg rounded-lg">
      <div className="bg-white rounded-t-lg   group-hover:bg-primary-blue transition-colors duration-500">
        <div className="px-4 py-2">
          <p className=" text-6xl md:text-7xl py-4 md:py-2 font-light text-center group-hover:text-white transition-colors duration-500">
            {czLetter[0]}
            {czLetter[1] || null}
          </p>
          <button className="w-8 md:w-12 m-auto block" onClick={() => handleTranslationAudioPlay('cs', czLetter[0])}>
            <PlayIcon className=" py-1 stroke-red-500 cursor-pointer" />
          </button>
          <p
            className={`${
              uaTranscription.length > 10
                ? 'text-base md:text-xl'
                : uaTranscription.length > 4
                ? 'text-xl md:text-3xl'
                : 'text-2xl md:text-4xl'
            }  md:text-4xl text-center text-[#676767] pt-2 md:pt-5 font-light group-hover:text-white transition-colors duration-500`}
          >
            {uaTranscription}
          </p>
        </div>
      </div>
      {/* Examples part */}
      <div className="bg-primary-yellow py-1 md:py-3 rounded-b-lg">
        <p className="font-sans px-4 text-center">Приклади</p>
        {examples.map(({ example, translation }, index) => {
          return (
            <div key={index} className="grid grid-cols-[45%_45%_10%] grid-flow-col items-center pt-[2px] px-4">
              <p className="font-light justift-self-start break-all text-sm md:text-sm">{example}</p>
              <p className="font-light text-xs md:text-sm">[{translation}]</p>
              <button onClick={() => handleTranslationAudioPlay('cs', example)}>
                <PlayIcon className="w-4 md:w-5 stroke-red-500 ml-1 cursor-pointer " />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
