import { CountryVariant } from "utils/locales";

interface HeaderNavigation {
  name: string;
  link: string;
  onlyForLanguageVariants?: CountryVariant
}

export const HEADER_NAVIGATION: HeaderNavigation[] = [
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
  },
  {
    name: 'header.wiki_link_name',
    link: '/wiki',
    onlyForLanguageVariants: "cs"
  },
  // {
  //   name: 'header.exercises_link_name',
  //   link: '/exercises',
  // },
  {
    name: 'header.about_link_name',
    link: '/about',
  },
  {
    name: 'header.contacts_link_name',
    link: '/contacts',
  },
];
