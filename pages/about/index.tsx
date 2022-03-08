/* eslint-disable react/jsx-key*/
import { useTranslation, Trans } from 'next-i18next';
import React from 'react';
export { getStaticProps } from '../../utils/localization';
import Link from 'next/link';

const LinkText = ({ href, children, target }: { href: string; children?: string; target?: '_blank' }) => {
  return (
    <Link href={href || ''}>
      <a target={target} className="underline text-primary-blue">
        {children}
      </a>
    </Link>
  );
};

const About = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="my-4 text-primary-blue">
        <Trans className="block my-2">{t('about_page.title')}</Trans>
      </h1>
      <h2 className="my-4 text-primary-blue">
        <Trans>{t('about_page.movapp_goal_title')}</Trans>
      </h2>
      <p>{t('about_page.movapp_goal_description')}</p>
      <h2 className="my-4 text-primary-blue">
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
      <h2 className="my-4 text-primary-blue">
        <Trans>{t('about_page.our_team_title')}</Trans>
      </h2>
      <Trans
        i18nKey={'about_page.our_team_description'}
        t={t}
        components={[<LinkText href="https://www.movapp.cz/contacts" target="_blank" />]}
      />
      <h2 className="my-4 text-primary-blue">
        <Trans>{t('about_page.stand_with_ukraine_title')}</Trans>
      </h2>
      <Trans
        i18nKey={'about_page.stand_with_ukraine_description'}
        t={t}
        components={[<LinkText href="https://stojimezaukrajinou.cz/" target="_blank" />]}
      />
      <h2 className="my-4 text-primary-blue">
        <Trans>{t('about_page.czech_digital_title')}</Trans>
      </h2>
      <Trans
        i18nKey={'about_page.czech_digital_description'}
        t={t}
        components={[<LinkText href="https://cesko.digital/" target="_blank" />]}
      />
      <div className="py-4">
        <h2 className="mb-2 text-primary-blue font-bold text-2xl">{t('about_page.contacts_title')}</h2>
        <p>
          Martin Hassman <p> email@email.cz</p> <p>+420 123 456 789</p>
        </p>
      </div>
    </div>
  );
};

export default About;
