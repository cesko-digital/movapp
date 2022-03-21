/* eslint-disable react/jsx-key*/
import { useTranslation, Trans } from 'next-i18next';
export { getStaticProps } from 'utils/localization';
import Link from 'next/link';
import Head from 'next/head';

export const LinkText = ({
  href,
  children,
  target,
  locale,
}: {
  href: string;
  children?: string;
  target?: '_blank' | '_self';
  locale?: string;
}) => {
  return (
    <Link locale={locale} href={href || ''}>
      <a target={target} className="underline text-primary-blue">
        {children}
      </a>
    </Link>
  );
};

const About = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const heading_style = 'mb-1 mt-5 sm:my-4 text-primary-blue';

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>{t('seo.about_page_title')}</title>
        <meta name="description" content={t('seo.about_page_description')} />
        <meta name="twitter:title" content={t('seo.about_page_title')} />
      </Head>
      <div className="max-w-7xl m-auto">
        <h1 className="text-primary-blue">
          <Trans className="block my-2">{t('about_page.title')}</Trans>
        </h1>
        <h2 className={heading_style}>
          <Trans>{t('about_page.movapp_goal_title')}</Trans>
        </h2>
        <p>{t('about_page.movapp_goal_description')}</p>
        <h2 className={heading_style}>
          <Trans>{t('about_page.why_movapp_title')}</Trans>
        </h2>
        <Trans
          i18nKey={'about_page.why_movapp_description'}
          t={t}
          components={[
            <LinkText href="https://creativecommons.org/licenses/by-nc/4.0/deed.cs" target="_blank" />,
            <LinkText href="https://drive.google.com/drive/u/0/folders/129vObZ0vUHpDd07slIfaiAfKsEbx1mNw" target="_blank" />,
          ]}
        />
        <h2 className={heading_style}>
          <Trans>{t('about_page.our_team_title')}</Trans>
        </h2>
        <Trans
          i18nKey={'about_page.our_team_description'}
          t={t}
          components={[<LinkText href={`/contacts`} locale={currentLanguage} target="_self" />]}
        />
        <h2 className={heading_style}>
          <Trans>{t('about_page.stand_with_ukraine_title')}</Trans>
        </h2>
        <Trans
          i18nKey={'about_page.stand_with_ukraine_description'}
          t={t}
          components={[<LinkText href="https://stojimezaukrajinou.cz/" target="_blank" />]}
        />
        <h2 className={heading_style}>
          <Trans>{t('about_page.czech_digital_title')}</Trans>
        </h2>
        <Trans
          i18nKey={'about_page.czech_digital_description'}
          t={t}
          components={[<LinkText href="https://cesko.digital/" target="_blank" />]}
        />
      </div>
    </>
  );
};

export default About;
