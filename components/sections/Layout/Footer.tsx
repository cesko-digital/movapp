import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { FOOTER_NAVIGATION } from 'data/footerNavigation';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { SocialMedia } from 'components/basecomponents/SocialMedia';

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
              <Link key={index} href={link}>
                <a target={'_blank'} className="sm:w-2/6">
                  <div className="py-1">
                    <p className="text-primary-black text-center text-sm sm:text-base font-bold my-2">{title}</p>
                    <p className="text-primary-black text-center font-light text-xs sm:text-sm">{t(description)}</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        <p className="text-primary-black text-center text-xs pt-10">
          {t('footer.join_development')}{' '}
          <Link href={'https://github.com/cesko-digital/movapp'}>
            <a target={'_blank'} className="underline">
              GitHub
            </a>
          </Link>{' '}
          | {t('footer.licence_intro')}{' '}
          <Link href={'https://creativecommons.org/licenses/by-nc/4.0/'}>
            <a target={'_blank'} className="underline" title="Creative Commons - Attribution required, Non-commercial use only 4.0">
              {t('footer.licence')}
            </a>
          </Link>
        </p>
      </div>
    </footer>
  );
};
