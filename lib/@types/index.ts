export interface UrlSet {
  url: UrlRecord[];
}

export interface UrlRecord {
  loc: string[];
  lastmod: string[];
  changefreq?: string[];
  priority?: number[];
}
