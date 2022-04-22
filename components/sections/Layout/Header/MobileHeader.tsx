import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HEADER_NAVIGATION } from 'data/headerNavigation';
import { Language, LOCALE_NAMES } from 'data/locales';
import BurgerIcon from 'public/icons/burger.svg';
import CloseIcon from 'public/icons/close.svg';
import AppLogo from 'public/icons/movapp-logo.png';
import { useLanguage } from 'utils/useLanguageHook';
import { getCountryVariant } from 'utils/countryVariant';

export const MobileHeader = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const handleCloseNavigation = () => {
      showNavigation && setShowNavigation(false);
    };

    router.events.on('routeChangeComplete', handleCloseNavigation);

    return () => {
      router.events.off('routeChangeComplete', handleCloseNavigation);
    };
  }, [router, showNavigation]);

  return (
    <header className="sm:hidden sticky top-0 h-14 bg-primary-blue z-10 w-full flex justify-between items-center px-2">
      <Link href={'/'}>
        <a className="logo">
          <Image src={AppLogo} width={150} height={45} alt="Movapp logo" />
        </a>
      </Link>
      <ul className="flex w-full justify-end pr-5 items-center">
        {['uk' as Language, getCountryVariant()].map((locale) => {
          return (
            <li key={locale} className={`${currentLanguage === locale && 'text-primary-yellow'} text-white mx-2`}>
              <Link href={router.asPath} locale={locale}>
                <a>{LOCALE_NAMES[locale]}</a>
              </Link>
            </li>
          );
        })}
      </ul>
      <div>
        {showNavigation ? <CloseIcon onClick={() => setShowNavigation(false)} /> : <BurgerIcon onClick={() => setShowNavigation(true)} />}
      </div>
      {/* Navigation dropdown */}
      {showNavigation && (
        <div className="bg-primary-blue z-50 absolute py-5 top-14 w-full left-0">
          <ul className="z-50">
            {HEADER_NAVIGATION.map(({ name, link }, index) => {
              return (
                <li key={index} className={`text-white text-center text-lg py-2 ${router.asPath.includes(link) && 'text-primary-yellow'}`}>
                  <Link href={link}>
                    <a>{t(name)}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};
