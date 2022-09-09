import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCountryVariant, Language, LOCALE_NAMES } from 'utils/locales';
import AppLogo from 'public/icons/movapp-logo.png';
import { useLanguage } from 'utils/useLanguageHook';
import clsx from 'clsx';
import BurgerIcon from 'public/icons/burger.svg';
import CloseIcon from 'public/icons/close.svg';
import { Navigation } from 'components/basecomponents/Navigation';

export const Header = () => {
  const router = useRouter();
  const [showNavigation, setShowNavigation] = React.useState(false);
  const { currentLanguage } = useLanguage();

  React.useEffect(() => {
    const handleCloseNavigation = () => {
      showNavigation && setShowNavigation(false);
    };

    router.events.on('routeChangeComplete', handleCloseNavigation);

    return () => {
      router.events.off('routeChangeComplete', handleCloseNavigation);
    };
  }, [router, showNavigation]);

  return (
    <header className="bg-primary-blue w-full sticky top-0 z-10 h-14 flex justify-between items-center px-2 md:block">
      <div className="md:max-w-7xl md:m-auto flex w-full h-full justify-between items-center">
        <Link href={'/'}>
          <a className="logo">
            <Image src={AppLogo} width={150} height={44} alt="Movapp logo" />
          </a>
        </Link>
        <Navigation showNavigation={showNavigation} />
        {['uk' as Language, getCountryVariant()].map((locale) => {
          return (
            <Link key={locale} href={router.asPath} locale={locale}>
              <a>
                <span className={clsx({ 'text-white cursor-pointer mx-2': true, 'text-primary-yellow': currentLanguage === locale })}>
                  {LOCALE_NAMES[locale]}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
      <BurgerIcon
        onClick={() => setShowNavigation(!showNavigation)}
        className={clsx({ 'ml-4 md:hidden md:ml-0 visible': true, hidden: showNavigation })}
      />
      <CloseIcon
        onClick={() => setShowNavigation(false)}
        className={clsx({ 'ml-4 md:hidden md:ml-0 visible': true, hidden: !showNavigation })}
      />
    </header>
  );
};
