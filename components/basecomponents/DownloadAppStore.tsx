import { useTranslation } from 'next-i18next';
import { AiFillApple } from 'react-icons/ai';

export const DOWNLOAD_IOS_URL = 'https://apps.apple.com/app/apple-store/id1617768476?pt=124252508&ct=web-movappcz&mt=8';

export const DownloadAppStore = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center align-middle">
      <a href={DOWNLOAD_IOS_URL} target="_blank" rel="noreferrer" className="bg-black text-white px-3 py-2 rounded-xl flex">
        <div>
          <AiFillApple size={56} className="mb-1 mr-1" />
        </div>
        <div className="flex flex-col justify-center mr-1">
          <div className="text-sm leading-none whitespace-nowrap">{t('homepage.download_on')}</div>
          <div className="text-3xl leading-none whitespace-nowrap">App Store</div>
        </div>
      </a>
    </div>
  );
};
