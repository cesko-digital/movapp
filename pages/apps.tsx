export { getStaticProps } from '../utils/localization';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DownloadAppStore, DOWNLOAD_IOS_URL } from '../components/basecomponents/DownloadAppStore';
import { DownloadGooglePlay, DOWNLOAD_ANDROID_URL } from '../components/basecomponents/DownloadGooglePlay';

const MobileAppsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent)) {
      router.push(DOWNLOAD_ANDROID_URL);
    }

    if (/iPad|iPhone|iPod/i.test(userAgent)) {
      router.push(DOWNLOAD_IOS_URL);
    }
  }, [router]);

  return (
    <div className="flex justify-center flex-col items-center text-center flex-grow">
      <h1 className="mb-8">{t('apps.download_app')}</h1>
      <div className="flex justify-center items-center flex-wrap">
        <DownloadAppStore />
        <DownloadGooglePlay />
      </div>
    </div>
  );
};

export default MobileAppsPage;
