import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'next-i18next';

/** Components */
import Image from 'next/image';

/** Hooks, Types, Utils */
import { Platform, KioskDictionaryCardImageProps } from '@types';
import { AudioPlayer } from '../../../utils/AudioPlayer';
import { useLanguage } from '../../../utils/useLanguageHook';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom, currentPlatformAtom } from 'components/basecomponents/Kiosk/atoms';

const PLAY_ACTION_LABEL = 'utils.play';
const IMAGE_SIZE = '20vw';

const KioskDictionaryCardImage = ({ phrase, imageUrl, id, isActive }: KioskDictionaryCardImageProps) => {
  const { otherLanguage } = useLanguage();
  const { t } = useTranslation();
  const platform = useAtomValue<Platform>(currentPlatformAtom);

  const [isPlaying, setIsPlaying] = useAtom(dictionaryAudioPlayAtom);
  const setActivePhrase = useSetAtom(dictionaryActivePhraseAtom);

  const onClickDefaultImage = useCallback(() => {
    AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage));
  }, [phrase, otherLanguage]);

  const onClickKioskImage = useCallback(async () => {
    if (isPlaying) return;
    setActivePhrase(phrase.getTranslation(otherLanguage));
    setIsPlaying(true);
    await AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage));
    setIsPlaying(false);
  }, [isPlaying, setActivePhrase, phrase, otherLanguage, setIsPlaying]);

  const className =
    platform === Platform.KIOSK
      ? `w-[400px] h-[280px] relative ${isActive ? 'bg-transparent' : 'bg-white'}`
      : 'w-72 h-72 relative bg-white';
  const onClick = platform === Platform.KIOSK ? onClickKioskImage : onClickDefaultImage;

  return (
    <button className={className} onClick={onClick} aria-label={`${t(PLAY_ACTION_LABEL)} ${otherLanguage}`}>
      <Image id={id} src={imageUrl ?? ''} layout="fill" sizes={IMAGE_SIZE} alt={phrase.getTranslation(otherLanguage)} />
    </button>
  );
};

export default KioskDictionaryCardImage;
