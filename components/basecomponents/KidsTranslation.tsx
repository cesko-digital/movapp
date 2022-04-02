import { useTranslation, Trans } from 'next-i18next';
import React from 'react';
import PlayKidsIcon from '../../public/icons/play-kids.svg';
import FlagCZIcon from '../../public/icons/cz.svg';
import FlagUAIcon from '../../public/icons/ua.svg';
import { Language } from '../../data/locales';
import { AudioPlayer } from 'components/utils/AudioPlayer';
interface KidsTranslationProps {
  translation: string;
  transcription: string;
  image: string;
  language: Language;
}

export const KidsTranslation = ({ transcription, translation, language: currentLanguage }: KidsTranslationProps): JSX.Element => {
  const { t } = useTranslation();

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
      <button
        onClick={() => AudioPlayer.getInstance().playTextToSpeech(translation, currentLanguage)}
        aria-label={t('utils.play') + ' ' + translation}
      >
        <PlayKidsIcon className="cursor-pointer active:scale-75 transition-all duration-300" />
      </button>
    </div>
  );
};
