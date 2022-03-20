export { getStaticProps } from '../utils/localization';
import { useTranslation } from 'next-i18next';
import NextErrorComponent from 'next/error';

const Custom404 = () => {
  const { t } = useTranslation();
  return <NextErrorComponent statusCode={404} title={t('errors.pageNotFound')} />;
};

export default Custom404;
