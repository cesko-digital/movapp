import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HeaderNavigation, HEADER_NAVIGATION, SubmenuItem } from 'data/headerNavigation';
import { getCountryVariant, Language, LOCALE_NAMES } from 'utils/locales';
import AppLogo from 'public/icons/movapp-logo.png';
import { useLanguage } from 'utils/useLanguageHook';
import { useClickOutside } from '../../../hooks/useClickOutside';
import clsx from 'clsx';
import BurgerIcon from 'public/icons/burger.svg';
import CloseIcon from 'public/icons/close.svg';

export const Header = () => {
  const router = useRouter();
  const [showNavigation, setShowNavigation] = useState(false);
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

interface OpenDropdown {
  open: boolean;
  id?: string;
}

interface NavigationItems extends HeaderNavigation {
  active?: boolean;
}

const Navigation: React.FC<{ showNavigation: boolean }> = ({ showNavigation }) => {
  const { asPath } = useRouter();
  const { t } = useTranslation('common');
  const [dropdown, setDropdown] = useState<OpenDropdown>({ open: false });
  const { ref } = useClickOutside<HTMLDivElement>(() => setDropdown({ open: false }));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.id;

    setDropdown({ open: !dropdown.open, id });
  };

  const items: NavigationItems[] = HEADER_NAVIGATION.map((item) => {
    const { link } = item;

    if (new RegExp(link).test(asPath)) {
      return {
        ...item,
        active: true,
      };
    }

    return { ...item };
  });

  return (
    <nav className="w-full pr-10">
      <div className="container flex flex-wrap justify-end items-center mx-auto" ref={ref}>
        <div className={clsx({ [stlyesNav.desktop]: !showNavigation, [stlyesNav.mobile]: showNavigation })}>
          <ul className="flex flex-col md:flex-row">
            {items.map(({ name, link, submenu, onlyForLanguageVariants, active }, index) => (
              <li
                className={clsx({
                  [stlyesNav.list]: true,
                  [stlyesNav.active]: active,
                  hidden: !!onlyForLanguageVariants && !onlyForLanguageVariants.includes(getCountryVariant()),
                })}
                key={index}
              >
                {submenu ? (
                  <>
                    <button id={index.toString()} type="button" onClick={handleClick}>
                      {t(name)}
                    </button>
                    <Dropdown submenu={submenu} dropdown={dropdown} id={index.toString()} callback={(val) => setDropdown({ open: val })} />
                  </>
                ) : (
                  <Link href={link}>{t(name)}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const stlyesNav = {
  desktop: 'hidden w-full md:block md:w-auto',
  mobile: 'bg-primary-blue z-50 absolute py-5 top-14 w-full left-0',
  list: 'md:hover:text-primary-yellow text-white flex mx-auto my-2 flex-col md:mx-2 md:my-0',
  active: 'text-primary-yellow md:text-white md:border-b-2 md:border-b-primary-yellow',
};

interface DropdownItems extends SubmenuItem {
  active?: boolean;
}

const Dropdown: React.FC<{ submenu: SubmenuItem[]; dropdown: OpenDropdown; id: string; callback: (val: boolean) => void }> = ({
  submenu,
  dropdown,
  id,
  callback,
}) => {
  const { t } = useTranslation('common');
  const { asPath } = useRouter();
  const visible = dropdown.id === id;

  const items: DropdownItems[] = submenu
    .filter((item) => item.countryVariant.includes(getCountryVariant()))
    .map((item) => {
      const { link } = item;

      if (link === asPath) {
        return {
          ...item,
          active: true,
        };
      }

      return { ...item };
    });

  return (
    <div className="mt-3 md:mt-0 md:absolute md:top-12">
      <ul className={clsx({ [stylesDrop.basic]: true, hidden: !visible || !dropdown.open })}>
        {items.map(({ name, link, active }, index) => {
          return (
            <li
              key={index}
              id={id}
              className={clsx({
                'text-primary-yellow md:text-gray-700 md:list-disc': active,
                'hover:text-primary-blue my-2 md:my-1 text-sm': true,
              })}
              onClick={() => callback(false)}
            >
              <Link href={link}>{t(name)}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const stylesDrop = {
  basic: ' bg-blue-600 text-white w-44 flex flex-col py-2 rounded-lg text-center md:text-left md:text-gray-700 md:pl-6 md:bg-white',
};
