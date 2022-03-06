export const getHighlightedText = (text: string, highlight: string) => {
  // Split text on highlight term, include term itself into parts, ignore case
  let previousLetterIndex = 0;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  const normalizedPart = toNormalized(text).split(new RegExp(`(${toNormalized(highlight)})`, 'gi'));

  return (
    <span>
      {normalizedPart.map((part, i) => {
        const currentPartLength = part.length;
        const newPart =
          i === 0 ? parts.slice(0, currentPartLength) : parts.slice(previousLetterIndex, previousLetterIndex + currentPartLength);

        previousLetterIndex += currentPartLength;
        return (
          <span
            key={i}
            style={toNormalized(part).toLowerCase() === toNormalized(highlight).toLowerCase() ? { fontWeight: 'bold', color: 'red' } : {}}
          >
            {i === 0 ? text.slice(0, currentPartLength) : text.slice(previousLetterIndex - currentPartLength, previousLetterIndex)}
          </span>
        );
      })}
    </span>
  );
};

const toNormalized = (text: string) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
