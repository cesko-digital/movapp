import React from 'react';
import { HeaderNavigation, HEADER_NAVIGATION } from 'data/headerNavigation';
import { useRouter } from 'next/router';
import { useClickOutside } from 'components/hooks/useClickOutside';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import { getCountryVariant } from 'utils/locales';
import { Dropdown } from './Dropdown';

export interface OpenDropdown {
  open: boolean;
  id?: string;
}

interface NavigationItems extends HeaderNavigation {
  active?: boolean;
}

export const Navigation: React.FC<{ showNavigation: boolean }> = ({ showNavigation }) => {
  const { asPath } = useRouter();
  const { t } = useTranslation('common');
  const [dropdown, setDropdown] = React.useState<OpenDropdown>({ open: false });
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
        <div className={clsx({ [styles.desktop]: !showNavigation, [styles.mobile]: showNavigation })}>
          <ul className="flex flex-col md:flex-row">
            {items.map(({ name, link, submenu, onlyForLanguageVariants, active }, index) => (
              <li
                className={clsx({
                  [styles.list]: true,
                  [styles.active]: active,
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

const styles = {
  desktop: 'hidden w-full md:block md:w-auto',
  mobile: 'bg-primary-blue z-50 absolute py-5 top-14 w-full left-0',
  list: 'md:hover:text-primary-yellow text-white flex mx-auto my-2 flex-col md:mx-2 md:my-0',
  active: 'text-primary-yellow md:text-white md:border-b-2 md:border-b-primary-yellow',
};
