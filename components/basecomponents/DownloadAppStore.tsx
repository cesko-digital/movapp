import { useTranslation } from 'next-i18next';
import { AiFillApple } from 'react-icons/ai';

export const DownloadAppStore = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto mb-12 mt-20 flex justify-center align-middle">
      <a
        href="https://apps.apple.com/app/movapp/id1617768476"
        target="_blank"
        rel="noreferrer"
        className="bg-black text-white px-3 py-2 rounded-xl flex"
      >
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
