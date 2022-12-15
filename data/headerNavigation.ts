import { CountryVariant } from 'utils/locales';

interface SubmenuItem {
  name: string;
  link: string;
  onlyForCountryVariants: readonly CountryVariant[];
}
type HeaderNavItem = {
  name: string;
  link: string;
  submenu: readonly SubmenuItem[] | undefined;
  onlyForCountryVariants: readonly CountryVariant[] | undefined;
};

type HeaderNavigation = readonly HeaderNavItem[];

export const HEADER_NAVIGATION = [
  {
    name: 'header.alphabet_link_name',
    link: '/alphabet',
    submenu: undefined,
    onlyForCountryVariants: undefined,
  },
  {
    name: 'header.vocabulary_link_name',
    link: '/dictionary',
    submenu: undefined,
    onlyForCountryVariants: undefined,
  },
  {
    name: 'header.forkids_link_name',
    link: '/kids',
    submenu: [
      {
        name: 'header.forkids_words',
        link: '/kids',
        onlyForCountryVariants: ['cs', 'pl', 'sk'],
      },
      {
        name: 'header.forkids_stories',
        link: '/kids/stories',
        onlyForCountryVariants: ['cs'],
      },
      {
        name: 'header.forkids_memorygame',
        link: '/kids/memory-game',
        onlyForCountryVariants: ['cs', 'pl', 'sk'],
      },
      {
        name: 'header.forkids_imagequiz',
        link: '/kids/image-quiz',
        onlyForCountryVariants: ['cs', 'pl', 'sk'],
      },
    ],
    onlyForCountryVariants: undefined,
  },
  {
    name: 'header.wiki_link_name',
    link: '/wiki',
    submenu: undefined,
    onlyForCountryVariants: ['cs'],
  },
  // {
  //   name: 'header.exercises_link_name',
  //   link: '/exercises',
  // },
  {
    name: 'header.about_link_name',
    link: '/about',
    submenu: undefined,
    onlyForCountryVariants: undefined,
  },
  {
    name: 'header.contacts_link_name',
    link: '/contacts',
    submenu: undefined,
    onlyForCountryVariants: undefined,
  },
] as const satisfies HeaderNavigation;
