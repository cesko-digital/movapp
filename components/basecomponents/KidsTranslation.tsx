import { useTranslation, Trans } from 'next-i18next';
import React from 'react';
import PlayKidsIcon from '../../public/icons/play-kids.svg';
import { Language } from '../../utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { Flag } from './Flag';
interface KidsTranslationProps {
  translation: string;
  transcription: string;
  soundUrl: string;
  language: Language;
}

export const KidsTranslation = ({ transcription, translation, language, soundUrl }: KidsTranslationProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center py-2 ">
      <div className="w-full">
        <div className="flex items-center mb-2">
          <Flag language={language} width={30} height={30} className={'mr-3'} />
          <p>
            <Trans className="block my-2">{t(`dictionary_page.${language}`)}</Trans>
          </p>
        </div>
        <p className="self-start w-full font-semibold">{translation}</p>
        <p className="text-gray-500">{`[ ${transcription} ]`}</p>
      </div>
      <button onClick={() => AudioPlayer.getInstance().playSrc(soundUrl)} aria-label={t('utils.play') + ' ' + translation}>
        <PlayKidsIcon className="cursor-pointer active:scale-75 transition-all duration-300" />
      </button>
    </div>
  );
};
