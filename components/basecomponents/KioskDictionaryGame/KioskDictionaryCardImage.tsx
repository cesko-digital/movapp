import { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useTranslation } from 'next-i18next';

/** Components */
import Image from 'next/image';

/** Hooks, Types, Utils */
import { Platform } from '@types';
import { Phrase } from 'utils/getDataUtils';
import { AudioPlayer } from '../../../utils/AudioPlayer';
import { useLanguage } from '../../../utils/useLanguageHook';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from 'components/basecomponents/Kiosk/atoms';
import { usePlatform } from 'utils/usePlatform';

const PLAY_ACTION_TRANSLATION_ID = 'utils.play';
const IMAGE_SIZE = '20vw';

type KioskDictionaryCardImageProps = {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  isActive?: boolean;
};

const KioskDictionaryCardImage = ({ phrase, imageUrl, id, isActive }: KioskDictionaryCardImageProps) => {
  const { otherLanguage } = useLanguage();
  const { t } = useTranslation();
  const platform = usePlatform();

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
    <button className={className} onClick={onClick} aria-label={`${t(PLAY_ACTION_TRANSLATION_ID)} ${otherLanguage}`}>
      <Image id={id} src={imageUrl ?? ''} layout="fill" sizes={IMAGE_SIZE} alt={phrase.getTranslation(otherLanguage)} />
    </button>
  );
};

export default KioskDictionaryCardImage;
