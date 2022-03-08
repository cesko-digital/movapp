/* eslint-disable react/jsx-key*/
import { Trans, useTranslation } from 'next-i18next';
import React from 'react';
import { LinkText } from '../about';
export { getStaticProps } from '../../utils/localization';

const Contacts = () => {
  const { t } = useTranslation();

  const heading_style = 'mb-1 mt-5 sm:mb-4 sm:mt-10 text-primary-blue';
  return (
    <div>
      <h2 className={`${heading_style}`}>
        <Trans>{t('contacts_page.email_contact_title')}</Trans>
      </h2>
      <p>{t('contacts_page.email_contact_link')}</p>
      <h2 className={`${heading_style}`}>
        <Trans>{t('contacts_page.social_media.social_media_title')}</Trans>
      </h2>
      <Trans
        i18nKey={'contacts_page.community_description'}
        t={t}
        components={[<LinkText href="https://cesko.digital/" target="_blank" />]}
      ></Trans>
      <h2 className={`${heading_style}`}>
        <Trans>{t('contacts_page.join_title')}</Trans>
      </h2>
      <p>
        <Trans
          i18nKey={'contacts_page.join_description'}
          t={t}
          components={[<LinkText href="https://cesko.digital/join" target="_blank" />]}
        ></Trans>
      </p>
    </div>
  );
};

export default Contacts;
