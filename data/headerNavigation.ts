import { CountryVariant, TranslationId } from 'utils/locales';

type SubmenuItem = {
  name: TranslationId;
  link: string;
  onlyForCountryVariants: CountryVariant[];
};

type HeaderNavItem = {
  name: TranslationId;
  link: string;
  submenu?: SubmenuItem[];
  onlyForCountryVariants?: CountryVariant[];
};

export const HEADER_NAVIGATION: HeaderNavItem[] = [
  {
    name: 'header.alphabet_link_name',
    link: '/alphabet',
  },
  {
    name: 'header.vocabulary_link_name',
    link: '/dictionary',
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
        onlyForCountryVariants: ['cs', 'sk'],
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
  },
  {
    name: 'header.exercises_link_name',
    link: '/exercise',
  },
  {
    name: 'header.wiki_link_name',
    link: '/wiki',
    onlyForCountryVariants: ['cs'],
  },
  {
    name: 'header.about_link_name',
    link: '/about',
  },
  {
    name: 'header.contacts_link_name',
    link: '/contacts',
  },
];
