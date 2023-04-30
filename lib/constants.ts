import path from 'path';

// Path to sitemap.xml
export const SITEMAP_XML_PATH: string = path.join('public', 'sitemap.xml');

// Site URLs
export const SITE_URLS: Record<string, string> = {
  cs: 'https://www.movapp.cz',
  sk: 'https://sk.movapp.eu',
  pl: 'https://pl.movapp.eu',
};
