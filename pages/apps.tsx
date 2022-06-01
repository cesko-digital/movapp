export { getStaticProps } from '../utils/localization';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DownloadAppStore } from '../components/basecomponents/DownloadAppStore';

const MobileAppsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    /* if (/android/i.test(userAgent)) {
    } */

    if (/iPad|iPhone|iPod/i.test(userAgent)) {
      router.push('https://apps.apple.com/app/apple-store/id1617768476?pt=124252508&ct=web-movappcz&mt=8');
    }
  }, []);

  return (
    <div className="flex justify-center flex-col items-center text-center flex-grow">
      <h1 className="mb-8">{t('apps.download_app')}</h1>
      <DownloadAppStore />
      <h2 className="mt-10">{t('apps.android_soon')}</h2>
    </div>
  );
};

export default MobileAppsPage;
