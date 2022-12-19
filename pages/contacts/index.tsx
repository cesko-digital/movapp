import SEO from 'components/basecomponents/SEO';
import { Trans, useTranslation } from 'next-i18next';
export { getStaticProps } from 'utils/localization';
import { SocialMedia } from 'components/basecomponents/SocialMedia';
import { TextLink } from 'components/Typography';

const Contacts = () => {
  const { t } = useTranslation();

  const email = t('contacts_page.email_contact_link');
  const heading_style = 'mb-1 mt-5 sm:mb-4 sm:mt-10 text-primary-blue';

  return (
    <>
      <SEO title={t('seo.contacts_page_title')} description={t('seo.contacts_page_description')} />
      <div className="max-w-7xl m-auto">
        <h1 className="text-primary-blue">{t('contacts_page.title')}</h1>
        <h2 className={`${heading_style}`}>
          <Trans>{t('contacts_page.email_contact_title')}</Trans>
        </h2>
        <a href={`mailto:${email}`}>{email}</a>
        <h2 className={`${heading_style}`}>
          <Trans>{t('contacts_page.social_media.social_media_title')}</Trans>
        </h2>
        <div className="mb-1 sm:mb-4">
          <SocialMedia />
        </div>
        <Trans
          i18nKey={'contacts_page.community_description'}
          t={t}
          components={[<TextLink href="https://cesko.digital/" target="_blank" key="cesko.digital" />]}
        ></Trans>
        <h2 className={`${heading_style}`}>
          <Trans>{t('contacts_page.join_title')}</Trans>
        </h2>
        <p>
          <Trans
            i18nKey={'contacts_page.join_description'}
            t={t}
            components={[<TextLink href="https://cesko.digital/join" target="_blank" key="cesko.digital/join" />]}
          ></Trans>
        </p>
      </div>
    </>
  );
};

export default Contacts;
