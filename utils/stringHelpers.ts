export const convertToSlug = (str: string): string => {
  str = str.toLowerCase().trim();

  // Remove accents
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Replace spaces with hyphens
  str = str.replace(/\s+/g, '-');

  // Remove special characters
  return str.replace(/[^a-z0-9-]/g, '');
};
