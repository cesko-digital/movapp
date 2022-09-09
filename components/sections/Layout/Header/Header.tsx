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

export const Header = () => {
  const router = useRouter();
  const { currentLanguage } = useLanguage();

  return (
    <header className="bg-primary-blue w-full sticky top-0 z-10 h-14 hidden md:block">
      <div className="max-w-7xl m-auto flex h-full justify-between items-center ">
        <Link href={'/'}>
          <a className="logo">
            <Image src={AppLogo} width={150} height={44} alt="Movapp logo" />
          </a>
        </Link>
        <Navigation />
        {['uk' as Language, getCountryVariant()].map((locale) => {
          return (
            <Link key={locale} href={router.asPath} locale={locale}>
              <a>
                <span className={clsx({ 'text-white cursor-pointer mx-2': true, [styles.currentLanguage]: currentLanguage === locale })}>
                  {LOCALE_NAMES[locale]}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

const styles = {
  currentLanguage: 'text-primary-yellow',
};

interface OpenDropdown {
  open: boolean;
  id?: string;
}

interface NavigationItems extends HeaderNavigation {
  active?: boolean;
}

const Navigation: React.FC = () => {
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
        <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
          <ul className="flex">
            {items.map(({ name, link, submenu, onlyForLanguageVariants, active }, index) => (
              <li
                className={clsx({
                  'hover:text-primary-yellow text-white mx-2 flex': true,
                  'border-b-2 border-b-primary-yellow': active,
                  hidden: !!onlyForLanguageVariants && !onlyForLanguageVariants.includes(getCountryVariant()),
                })}
                aria-haspopup="menu"
                key={index}
              >
                {submenu ? (
                  <>
                    <button
                      id={index.toString()}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={dropdown ? 'true' : 'false'}
                      onClick={handleClick}
                    >
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
    <div className={`absolute top-12`}>
      <ul className={clsx({ [stylesDrop.basic]: true, hidden: !visible || !dropdown.open })}>
        {items.map(({ name, link, active }, index) => {
          return (
            <li
              key={index}
              id={id}
              className={clsx({ [stylesDrop.active]: active, 'hover:text-primary-blue py-1 text-sm': true })}
              onClick={() => 
                callback(false)
              }
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
  basic: 'bg-white text-gray-700 w-44 flex flex-col pl-6 py-2 rounded-lg',
  active: 'list-disc',
};
