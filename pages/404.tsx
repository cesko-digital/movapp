export { getStaticProps } from '../utils/localization';
import { useTranslation } from 'next-i18next';
import { usePlausible } from 'next-plausible';
import NextErrorComponent from 'next/error';
import { useEffect } from 'react';

const Custom404 = () => {
  const { t } = useTranslation();
  const plausible = usePlausible();
  useEffect(() => {
    plausible('404', { props: { path: document.location.pathname } });
  }, [plausible]);

  return <NextErrorComponent statusCode={404} title={t('errors.pageNotFound')} />;
};

export default Custom404;
