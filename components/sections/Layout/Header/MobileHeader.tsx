import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HEADER_NAVIGATION } from 'data/headerNavigation';
import { getCountryVariant, Language, LOCALE_NAMES } from 'utils/locales';
import BurgerIcon from 'public/icons/burger.svg';
import CloseIcon from 'public/icons/close.svg';
import AppLogo from 'public/icons/movapp-logo.png';
import { useLanguage } from 'utils/useLanguageHook';

export const MobileHeader = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
    <header className="md:hidden sticky top-0 h-14 bg-primary-blue z-10 w-full flex justify-between items-center px-2">
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
            {HEADER_NAVIGATION.map(({ name, link, submenu, onlyForCountryVariants }, index) => {
              if (onlyForCountryVariants && !onlyForCountryVariants.includes(getCountryVariant())) return;
              return (
                <li key={index} className={`text-white text-center text-lg py-2 ${router.asPath.includes(link) && 'text-primary-yellow'}`}>
                  {submenu === undefined ? (
                    <Link href={link}>
                      <a>{t(name)}</a>
                    </Link>
                  ) : (
                    <>
                      <button onClick={() => setShowDropdown(!showDropdown)}>{t(name)}</button>
                      <div className={`${showDropdown ? '' : 'hidden'} w-44 m-auto`}>
                        <ul className="py-1 text-sm text-white text-center">
                          {submenu
                            ?.filter((item) => item.onlyForCountryVariants.includes(getCountryVariant()))
                            .map(({ name, link }) => (
                              <li key={name}>
                                <Link href={link}>
                                  <a className="block px-4 py-2">{t(name)}</a>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};
