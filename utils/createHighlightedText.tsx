export const createHighlightedText = (text: string, searchText: string) => {
  if (searchText.trim() === '') return text;
  const regex = RegExp(searchText, 'gi');
  const str1 = text;

  let match;
  let highlightedText = text;

  let iteration = 0;

  const strongTag = '<strong></strong>';

  while ((match = regex.exec(str1)) !== null) {
    // after first iteration we should add strongTag length to each matched index because we
    // we add strong tag to matched text causing text length increase
    const start =
      iteration === 0
        ? highlightedText.substring(0, match.index)
        : highlightedText.substring(0, match.index + iteration * strongTag.length);
    const end =
      iteration === 0
        ? highlightedText.substring(regex.lastIndex)
        : highlightedText.substring(regex.lastIndex + iteration * strongTag.length);

    highlightedText = `${start}<strong>${match[0]}</strong>${end}`;

    iteration += 1;
  }

  return highlightedText;
};
