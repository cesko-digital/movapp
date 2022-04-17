export const normalizeForSearch = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const normalizeForCategoryLink = (text: string) => {
  return normalizeForSearch(text).replace(/\s+/g, '_');
};

export const normalizeForId = (text: string) => {
  return normalizeForCategoryLink(text).replace(/[()]/g, '');
};

export const normalizeWikiPagesUrl = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/--{1,5}/g, '-');
};
