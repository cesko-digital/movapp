import { useTranslation, Trans } from 'next-i18next';
import React, { useCallback, useState } from 'react';
import PlayKidsIcon from '../../public/icons/play.svg';
import { Language } from '../../utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { Flag } from './Flag';
import styles from './KidsTranslation.module.css';
interface KidsTranslationProps {
  translation: string;
  transcription: string;
  soundUrl: string;
  language: Language;
}

export const KidsTranslation = ({ transcription, translation, language, soundUrl }: KidsTranslationProps): JSX.Element => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = useCallback(async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      await AudioPlayer.getInstance().playSrc(soundUrl);
      setIsPlaying(false);
    }
  }, [isPlaying, soundUrl]);

  // add non-breaking space after and before square brackets
  const transformText = (text: string) => {
    return text.replace(/\[ /g, '\u005B\u00A0').replace(/\ ]/g, '\u00A0\u005D');
  };

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
        <p className="text-gray-500">{transformText(`[ ${transcription} ]`)}</p>
      </div>
      <button onClick={handleClick} aria-label={t('utils.play') + ' ' + translation}>
        <PlayKidsIcon
          className={`cursor-pointer active:scale-75 transition-all duration-300 w-14 ${styles.playIcon} ${isPlaying ? styles.pulse : ''}`}
        />
      </button>
    </div>
  );
};
