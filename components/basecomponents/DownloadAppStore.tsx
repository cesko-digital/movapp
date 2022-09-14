import { useTranslation } from 'next-i18next';
import { AiFillApple } from 'react-icons/ai';

export const DOWNLOAD_IOS_URL = 'https://apps.apple.com/app/apple-store/id1617768476?pt=124252508&ct=web-movappcz&mt=8';

export const DownloadAppStore = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-[4.5rem]">
      <a
        href={DOWNLOAD_IOS_URL}
        target="_blank"
        rel="noreferrer"
        className="bg-black text-white px-1 py-1 rounded-lg flex border-2 border-gray-300 min-w-[216px]"
      >
        <div>
          <AiFillApple size={49} className="mb-1 mr-1" />
        </div>
        <div className="flex flex-col justify-center mr-1">
          <div className="text-sm leading-none whitespace-nowrap">{t('homepage.download_on')}</div>
          <div className="text-2xl leading-none whitespace-nowrap">App Store</div>
        </div>
      </a>
    </div>
  );
};
