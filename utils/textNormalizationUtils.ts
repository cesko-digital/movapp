export const normalize = (text: string) => {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      // Remove this range of characters
      .replace(/[\u0300-\u036f]/g, '')
  );
};

export const normalizeForId = (text: string) => {
  return (
    normalize(text)
      .toLowerCase()
      // Replace whitespace characters with underscore
      .replace(/\s+/g, '_')
      // Remove parantheses
      .replace(/[()]/g, '')
  );
};

export const firstLetterToUpperCase = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);
