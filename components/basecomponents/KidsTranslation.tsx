import { useTranslation, Trans } from 'next-i18next';
import React from 'react';
import PlayKidsIcon from '../../public/icons/play-kids.svg';
import FlagCZIcon from '../../public/icons/cz.svg';
import FlagUAIcon from '../../public/icons/ua.svg';
import { Language } from '../../data/locales';

interface KidsTranslationProps {
  translation: string;
  transcription: string;
  image: string;
  player: HTMLAudioElement | null;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  currentLanguage: Language;
}

export const KidsTranslation = ({ transcription, translation, player, setPlayer, currentLanguage }: KidsTranslationProps): JSX.Element => {
  const { t } = useTranslation();

  const handleTranslationAudioPlay = (language: Language, text: string) => {
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
    <div className="flex justify-between items-center py-2 ">
      <div className="w-full">
        <div className="flex">
          {currentLanguage === 'cs' ? (
            <FlagCZIcon width="30px" height="24px" className="mr-3 shadow" />
          ) : (
            <FlagUAIcon width="30px" height="24px" className="mr-3 shadow" />
          )}
          <p>
            <Trans className="block my-2">{t(`dictionary_page.${currentLanguage}`)}</Trans>
          </p>
        </div>
        <p className="self-start w-full font-semibold">{translation}</p>
        <p className="text-gray-500">{`[ ${transcription} ]`}</p>
      </div>
      <button onClick={() => handleTranslationAudioPlay(currentLanguage, translation)} aria-label="play">
        <PlayKidsIcon className="cursor-pointer active:scale-75 transition-all duration-300" />
      </button>
    </div>
  );
};
