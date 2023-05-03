import { useLanguage } from '../../utils/useLanguageHook';
import Image from 'next/image';

export const DOWNLOAD_ANDROID_URL = 'https://play.google.com/store/apps/details?id=cz.movapp.app';

/* eslint-disable @next/next/no-img-element */
export const DownloadGooglePlay = () => {
  const { currentLanguage } = useLanguage();
  const badgeLanguage = currentLanguage === 'uk' ? 'ua' : currentLanguage;
  return (
    <a href={DOWNLOAD_ANDROID_URL} target="_blank" rel="noreferrer">
      <Image src={`/images/google-play-badge/google-play-badge_${badgeLanguage}.png`} alt="Get it on Google Play" width={248} height={96} />
    </a>
  );
};
