import { useTranslation } from 'next-i18next';
import React from 'react';
export { getStaticProps } from '../../utils/localization';

const About = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="leading-7 sm:leading-9  mb-8">{t('about_page.description_1')}</p>
      <p className="leading-7 sm:leading-9 mb-8">{t('about_page.description_2')}</p>
      <div className="py-4">
        <p className="mb-2 text-primary-blue font-bold text-2xl">{t('about_page.contacts_title')}</p>
        <p>
          Martin Hassman <p> email@email.cz</p> <p>+420 123 456 789</p>
        </p>
      </div>
    </div>
  );
};

export default About;
