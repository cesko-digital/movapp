import { useLanguage } from '../../utils/useLanguageHook';

export const DOWNLOAD_ANDROID_URL = 'https://play.google.com/store/apps/details?id=cz.movapp.app';

/* eslint-disable @next/next/no-img-element */
export const DownloadGooglePlay = () => {
  const { currentLanguage } = useLanguage();
  const badgeLanguage = currentLanguage === 'uk' ? 'ua' : currentLanguage;
  return (
    <a href={DOWNLOAD_ANDROID_URL} target="_blank" rel="noreferrer">
      <img
        className="h-24 min-w-[240px]"
        alt="Get it on Google Play"
        src={`https://play.google.com/intl/en_us/badges/static/images/badges/${badgeLanguage}_badge_web_generic.png`}
      />
    </a>
  );
};
