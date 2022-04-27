import { AudioPlayer } from 'utils/AudioPlayer';
import { Language } from 'utils/locales';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import PlayIcon from '../../public/icons/play.svg';

const LETTERS_WITHOUT_AUDIO = ['ь'];

interface AlphabetCardProps {
  examples: {
    example: string;
    example_transcription: string;
  }[];
  letter: [string, string | null];
  transcription: string;
  language: Language;
}

export const AlphabetCard = ({ examples, letter, transcription, language: playerLanguage }: AlphabetCardProps): JSX.Element => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrcPath = `alphabet/${playerLanguage}-alphabet/${letter[0].toLowerCase()}.mp3`;
  const letterHasAudio = !LETTERS_WITHOUT_AUDIO.includes(letter[0]);
  const letterSpacer = ' ';

  return (
    <div className=" grid grid-rows-[66%_34%]  shadow-[0_3px_15px_grey] sm:shadow-none group sm:hover:shadow-lg rounded-lg">
      {/* Letter description */}
      <div className="bg-white rounded-t-lg  group-hover:bg-primary-blue transition-colors duration-500">
        <div className="px-4 py-2 h-full grid grid-rows-[40%_30%_30%]">
          <p className=" text-7xl  sm:text-6xl md:text-7xl py-4 md:py-2 font-light text-center group-hover:text-white transition-colors duration-500">
            {letter[0]}
            {letterSpacer}
            {letter[1]}
          </p>
          <div className="self-end">
            {letterHasAudio && (
              <button
                onClick={() => AudioPlayer.getInstance().play(audioRef.current)}
                className="w-16 sm:w-8 md:w-12 m-auto block"
                aria-label={t('utils.play') + ' ' + letter[0]}
              >
                <audio ref={audioRef} src={audioSrcPath} />
                <PlayIcon className="py-1 stroke-red-500 cursor-pointer" />{' '}
              </button>
            )}
          </div>
          <p
            className={`${
              transcription.length > 30
                ? 'text-sm'
                : transcription.length > 10
                ? 'text-xl sm:text-base md:text-xl'
                : transcription.length > 4
                ? 'text-3xl sm:text-xl md:text-3xl'
                : 'text-4xl sm:text-2xl md:text-4xl'
            } pt-2 md:pt-5 
               text-center text-[#676767]  font-light group-hover:text-white transition-colors duration-500`}
          >
            {transcription}
          </p>
        </div>
      </div>
      {/* Examples part */}
      <div className="bg-primary-yellow py-1 md:py-3 rounded-b-lg">
        {examples.map(({ example, example_transcription }, index) => {
          return (
            <div key={index} className="grid grid-cols-[40%_45%_15%] grid-flow-col items-center pt-3 px-4">
              <p className="font-light justift-self-start break-all text-base sm:text-xs md:text-sm">{example}</p>
              <p className="font-light text-base sm:text-xs md:text-sm">[{example_transcription}]</p>
              <button
                className="justify-self-end"
                onClick={() => AudioPlayer.getInstance().playTextToSpeech(example, playerLanguage)}
                aria-label={t('utils.play') + ' ' + example}
              >
                <PlayIcon className="w-7 sm:w-4 md:w-5 stroke-red-500  cursor-pointer " />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
