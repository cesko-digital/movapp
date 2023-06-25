import { useCallback } from 'react';
import { useTranslation, Trans } from 'next-i18next';

/** Components */
import PlayKidsIcon from '../../public/icons/play.svg';
import { Flag } from './Flag';
import { AudioPlayer } from 'utils/AudioPlayer';

/** Hooks, Types, Utils */
import styles from './KidsTranslation.module.css';
import { Platform } from '@types';
import { Language } from 'utils/locales';
import { useAtom } from 'jotai';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from 'components/basecomponents/Kiosk/atoms';
import { usePlatform } from 'utils/usePlatform';
const PLAY_ACTION_TRANSLATION_ID = 'utils.play';
const KIOSK_BG_COLOR_UK = '#FFF7D5';
const KIOSK_BG_COLOR_OTHER = '#FFE1DE';

type KidsTranslationProps = {
  translation: string;
  transcription: string;
  soundUrl: string;
  language: Language;
  isActive?: boolean;
  isCard?: boolean;
};

export const KidsTranslation = ({
  transcription,
  translation,
  language,
  soundUrl,
  isActive = false,
  isCard = false,
}: KidsTranslationProps): JSX.Element => {
  const [audioPlaying, setIsPlaying] = useAtom(dictionaryAudioPlayAtom);
  const [activePhrase, setActivePhrase] = useAtom(dictionaryActivePhraseAtom);
  const renderFor = usePlatform();

  const { t } = useTranslation();
  const handleClick = useCallback(async () => {
    if (audioPlaying) {
      return;
    }
    setActivePhrase(translation);
    setIsPlaying(true);
    await AudioPlayer.getInstance().playSrc(soundUrl);
    setIsPlaying(false);
  }, [audioPlaying, soundUrl, setIsPlaying, setActivePhrase, translation]);

  /* Kids Translation as default (web site) */
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
        <button onClick={handleClick} aria-label={`${t(PLAY_ACTION_TRANSLATION_ID)} ${translation}`}>
          <PlayKidsIcon
            className={`cursor-pointer active:scale-75 transition-all duration-300 w-14 ${styles.playIcon} ${
              activePhrase === translation && audioPlaying ? styles.pulse : ''
            }`}
          />
        </button>
      </div>
    );
  };

  /** Kids Translation as card */
  const renderAsCard = () => {
    return (
      <div className="flex justify-between items-center py-3 px-5 bg-white rounded-xl shadow-xl mb-20">
        <div className="w-full">
          <div className="flex items-center mb-2 w-56">
            <Flag language={language} width={30} height={30} className={'mr-3'} />
            <p>
              <Trans className="block my-2">{t(`dictionary_page.${language}`)}</Trans>
            </p>
          </div>
          <p className="self-start w-full">{translation}</p>
          <p className="text-gray-500">{`[\u00A0${transcription}\u00A0]`}</p>
        </div>
        <button onClick={handleClick} aria-label={`${t(PLAY_ACTION_TRANSLATION_ID)} ${translation}`}>
          <PlayKidsIcon
            className={`cursor-pointer active:scale-75 transition-all duration-300 w-24 ${styles.playIcon} ${
              activePhrase === translation && audioPlaying ? styles.pulse : ''
            }`}
          />
        </button>
      </div>
    );
  };

  /** Kids Translation for kids kiosk */
  const renderForKiosk = () => {
    const playButtonClasses = `flex grow  ${language === 'uk' ? `bg-[${KIOSK_BG_COLOR_UK}]` : `bg-[${KIOSK_BG_COLOR_OTHER}]`} ${
      isActive ? 'flex-row w-full justify-center items-center h-[122px]' : 'flex-col justify-between items-center py-5 w-1/2'
    }`;
    return (
      <div className={playButtonClasses} onClick={handleClick} aria-label={`${t(PLAY_ACTION_TRANSLATION_ID)} ${translation}`}>
        <div className="flex items-center mb-2 z-50">
          <Flag language={language} width={50} height={50} className={'mr-3'} />
        </div>
        <p className={`text-center font-semibold ${isActive ? 'text-2xl' : ''}`}>{translation}</p>
      </div>
    );
  };

  switch (renderFor) {
    case Platform.KIOSK:
      return isCard ? renderAsCard() : renderForKiosk();
    case Platform.WEB:
    default:
      return renderDefault();
  }
};
