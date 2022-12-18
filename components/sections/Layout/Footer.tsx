import { SocialMedia } from 'components/basecomponents/SocialMedia';
import { FOOTER_NAVIGATION } from 'data/footerNavigation';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';

const Feedback = dynamic(() => import('../../basecomponents/Feedback'), {
  ssr: false,
});

export const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const footerNavigationLinks = FOOTER_NAVIGATION[getCountryVariant()][currentLanguage];

  return (
    <footer className="bg-primary-yellow">
      <div className="max-w-4xl m-auto p-2 sm:py-5 ">
        <p className="text-primary-black text-center font-black text-xl sm:text-2xl mt-2 sm:mt-4 mb-2 sm:mb-6">#StandWithUkraine</p>
        <div className="text-center">
          <SocialMedia />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start">
          {footerNavigationLinks?.map(({ title, link, description }, index) => {
            return (
              <a key={index} href={link} target={'_blank'} className="sm:w-2/6" rel="noopener">
                <div className="py-1">
                  <p className="text-primary-black text-center text-sm sm:text-base font-bold my-2">{title}</p>
                  <p className="text-primary-black text-center font-light text-xs sm:text-sm">{description}</p>
                </div>
              </a>
            );
          })}
        </div>
        <Feedback />
        <p className="text-primary-black text-center text-xs pt-6">
          {t('footer.join_development')}{' '}
          <a href={'https://github.com/cesko-digital/movapp'} target={'_blank'} className="underline" rel="noopener">
            GitHub
          </a>{' '}
          | {t('footer.licence_intro')}{' '}
          <a
            href={'https://creativecommons.org/licenses/by-nc/4.0/'}
            target={'_blank'}
            className="underline"
            rel="noopener"
            title="Creative Commons - Attribution required, Non-commercial use only 4.0"
          >
            {t('footer.licence')}
          </a>
        </p>
      </div>
    </footer>
  );
};
