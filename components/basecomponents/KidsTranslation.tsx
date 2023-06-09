import { useTranslation, Trans } from 'next-i18next';
import React, { useCallback } from 'react';
import PlayKidsIcon from '../../public/icons/play.svg';
import { Language } from '../../utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { Flag } from './Flag';
import styles from './KidsTranslation.module.css';
import { Platform } from '@types';

import { useAtom } from 'jotai';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from 'components/basecomponents/Kiosk/atoms';
interface KidsTranslationProps {
  translation: string;
  transcription: string;
  soundUrl: string;
  language: Language;
  renderFor?: Platform;
  isActive?: boolean;
}

export const KidsTranslation = ({
  transcription,
  translation,
  language,
  soundUrl,
  renderFor = Platform.WEB,
  isActive = false,
}: KidsTranslationProps): JSX.Element => {
  const [audioPlaying, setIsPlaying] = useAtom(dictionaryAudioPlayAtom);
  const [activePhrase, setActivePhrase] = useAtom(dictionaryActivePhraseAtom);
  const { t } = useTranslation();
  const handleClick = useCallback(async () => {
    if (audioPlaying) {
      return;
    }
    setActivePhrase(translation);
    setIsPlaying(true);
    await AudioPlayer.getInstance().playSrc(soundUrl);
    setIsPlaying(false);
  }, [audioPlaying, soundUrl]);

  const renderDefault = () => {
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
          <p className="text-gray-500">{`[\u00A0${transcription}\u00A0]`}</p>
        </div>
        <button onClick={handleClick} aria-label={`${t('utils.play')} ${translation}`}>
          <PlayKidsIcon
            className={`cursor-pointer active:scale-75 transition-all duration-300 w-14 ${styles.playIcon} ${
              activePhrase === translation && audioPlaying ? styles.pulse : ''
            }`}
          />
        </button>
      </div>
    );
  };

  const renderForKiosk = () => {
    const playButtonClasses = `flex grow  ${language == 'uk' ? 'bg-[#FFF7D5]' : 'bg-[#FFE1DE]'} ${
      isActive ? 'flex-row w-full justify-center items-center h-[122px]' : 'flex-col justify-between items-center py-5 w-1/2'
    }`;
    return (
      <div className={playButtonClasses} onClick={handleClick} aria-label={`${t('utils.play')} ${translation}`}>
        <div className="flex items-center mb-2 z-50">
          <Flag language={language} width={50} height={50} className={'mr-3'} />
        </div>
        <p className={`text-center font-semibold ${isActive ? 'text-2xl' : ''}`}>{translation}</p>
      </div>
    );
  };

  switch (renderFor) {
    case Platform.KIOSK:
      return renderForKiosk();
    case Platform.WEB:
    default:
      return renderDefault();
  }
};
