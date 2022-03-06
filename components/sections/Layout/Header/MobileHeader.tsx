import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { HEADER_NAVIGATION } from '../../../../data/headerNavigation';
import { LOCALES } from '../../../../data/locales';
import BurgerIcon from '../../../../public/icons/burger.svg';
import CloseIcon from '../../../../public/icons/close.svg';

export const MobileHeader = () => {
  const [showNavigation, setShowNavigation] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();

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
    <div className="sm:hidden sticky top-0 h-10 bg-primary-blue w-full flex justify-between items-center px-2">
      <div>MOVAPP</div>
      <ul className="flex w-full justify-end pr-5 items-center">
        {LOCALES.map(({ name, locale }, index) => {
          return (
            <Link key={index} href={router.asPath} locale={locale}>
              <a>
                <li className={`${i18n.language === locale && 'text-primary-yellow'} text-white mx-2`}>{name}</li>
              </a>
            </Link>
          );
        })}
      </ul>
      <div>
        {showNavigation ? <CloseIcon onClick={() => setShowNavigation(false)} /> : <BurgerIcon onClick={() => setShowNavigation(true)} />}
      </div>
      {/* Navigation dropdown */}
      {showNavigation && (
        <div className="bg-primary-blue absolute py-5 top-10 w-full left-0">
          <ul>
            {HEADER_NAVIGATION.map(({ name, link }, index) => {
              return (
                <Link key={index} href={link}>
                  <a>
                    <li className={`text-white text-center text-lg py-2 ${router.asPath.includes(link) && 'text-primary-yellow'}`}>
                      {t(name)}
                    </li>
                  </a>
                </Link>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
