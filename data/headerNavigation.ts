interface SubmenuItem {
  name: string;
  link: string;
}

interface HeaderNavigation {
  name: string;
  link: string;
  submenu?: SubmenuItem[];
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
    submenu: [
      {
        name: 'header.forkids_words',
        link: '/kids',
      },
      {
        name: 'header.forkids_stories',
        link: '/kids/stories',
      },
      {
        name: 'header.forkids_memorygame',
        link: '/kids/memory-game',
      },
    ],
  },
  {
    name: 'header.wiki_link_name',
    link: '/wiki',
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
