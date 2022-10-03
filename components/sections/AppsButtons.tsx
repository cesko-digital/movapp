import { useTranslation } from 'next-i18next';
import { DownloadAppStore } from 'components/basecomponents/DownloadAppStore';
import { DownloadGooglePlay } from 'components/basecomponents/DownloadGooglePlay';

export const AppsButtons = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto my-10 flex flex-col items-center">
      <h2 className="mb-3 text-2xl px-2">{t(`homepage.download_app`)}</h2>
      <div className="flex flex-col md:flex-row items-center gap-x-4">
        <div className="mx-auto md:mx-0 hover:scale-110 transition-all">
          <DownloadAppStore />
        </div>
        <div className="mx-auto md:mx-0 hover:scale-110 transition-all">
          <DownloadGooglePlay />
        </div>
      </div>
    </div>
  );
};
