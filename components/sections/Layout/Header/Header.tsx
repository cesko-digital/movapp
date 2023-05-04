import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HEADER_NAVIGATION } from 'data/headerNavigation';
import { getCountryVariant, Language, LOCALE_NAMES } from 'utils/locales';
import AppLogo from 'public/icons/movapp-logo.png';
import { useLanguage } from 'utils/useLanguageHook';
import { useClickOutside } from '../../../hooks/useClickOutside';

export const Header = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const { ref } = useClickOutside<HTMLDivElement>(() => setShowDropdown(false));

  return (
    <header className="bg-primary-blue w-full sticky top-0 z-10 h-14 hidden md:block">
      <div className="max-w-7xl m-auto flex h-full justify-between items-center ">
        <Link href={'/'} className="logo">
          <Image src={AppLogo} width={150} height={44} alt="Movapp logo" />
        </Link>
        <nav className="w-full">
          <ul className="flex justify-end items-center pr-10">
            {HEADER_NAVIGATION.map(({ name, link, submenu, onlyForCountryVariants }) => {
              const activePage = router.asPath.includes(link);
              if (onlyForCountryVariants?.includes(getCountryVariant()) === false) return;
              return (
                <li
                  key={name}
                  className={`${activePage && 'border-b-2 border-b-primary-yellow'} hover:text-primary-yellow text-white mx-2 `}
                >
                  {submenu === undefined ? (
                    <Link href={link}>{t(name)}</Link>
                  ) : (
                    <div ref={ref}>
                      <button onClick={() => setShowDropdown(!showDropdown)}>{t(name)}</button>
                      <div
                        className={`absolute z-10 ${showDropdown ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded shadow w-44`}
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          {submenu
                            ?.filter((item) => item.onlyForCountryVariants.includes(getCountryVariant()))
                            .map(({ name, link }) => (
                              <li key={name}>
                                <Link href={link} onClick={() => setShowDropdown(false)} className="block px-4 py-2 hover:bg-gray-100">
                                  {t(name)}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {['uk' as Language, getCountryVariant()].map((locale) => {
          return (
            <Link key={locale} href={router.asPath} locale={locale}>
              <span className={`cursor-pointer mx-2 ${currentLanguage === locale ? 'text-primary-yellow' : 'text-white'}`}>
                {LOCALE_NAMES[locale]}
              </span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
