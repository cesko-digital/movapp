export { getStaticProps } from '../utils/localization';
import { useTranslation } from 'next-i18next';
import { DownloadAppStore } from '../components/basecomponents/DownloadAppStore';

const Custom404 = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center flex-col items-center flex-grow">
      <h1 className="mb-8">Download Movapp as a mobile app</h1>
      <DownloadAppStore />
      <h2 className="mt-10">Android version coming soon!</h2>
    </div>
  );
};

export default Custom404;
