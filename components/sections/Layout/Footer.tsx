import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_NAVIGATION } from 'data/footerNavigation';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';

export const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const footerNavigationLinks = Object.entries(FOOTER_NAVIGATION)
    .map(([country, links]) => {
      if (getCountryVariant() === country) return links[currentLanguage];
    })
    .filter((links) => links)
    .flat();

  return (
    <footer className="bg-primary-yellow">
      <div className="max-w-4xl m-auto p-2 sm:py-5 ">
        <p className="text-primary-black text-center font-black text-xl sm:text-2xl mt-2 sm:mt-4 mb-2 sm:mb-6">#StandWithUkraine</p>
        <div className="text-center">
          <a href="https://www.facebook.com/movappcz" target="_blank" rel="noreferrer" className="mr-2">
            <Image src="/icons/socials/facebook.svg" width="34px" height="34px" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/movappcz/" target="_blank" rel="noreferrer" className="mr-2">
            <Image src="/icons/socials/instagram.svg" width="34px" height="34px" alt="Instagram" />
          </a>
          <a href="https://twitter.com/movappcz" target="_blank" rel="noreferrer" className="ml-2">
            <Image src="/icons/socials/twitter.svg" width="34px" height="34px" alt="Twitter" />
          </a>
          <a href="https://www.linkedin.com/company/movapp-cz/" target="_blank" rel="noreferrer" className="ml-2">
            <Image src="/icons/socials/linkedin.svg" width="34px" height="34px" alt="LinkedIn" />
          </a>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start">
          {footerNavigationLinks.map(({ title, link, description }, index) => {
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
              Github
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
