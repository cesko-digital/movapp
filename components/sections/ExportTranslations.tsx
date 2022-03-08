import { useState } from 'react';
import { Button } from '../basecomponents/Button';
import { Translation } from '../basecomponents/TranslationContainer';

interface ExportTranslationsProps {
  translations: Translation[];
  category: string;
}

interface SeparatorOption {
  id: string;
  name: string;
  value: string;
  displayValue?: JSX.Element;
}
const TRANSLATION_SEPARATORS: SeparatorOption[] = [
  { id: 'transl_comma', name: 'comma', value: ',' },
  { id: 'transl_semicolor', name: 'semicolon', value: ';' },
  { id: 'trans_tab', name: 'tab', value: '    ', displayValue: <span>&nbsp;&nbsp;&nbsp;&nbsp;</span> },
];

const PHRASE_SEPARATORS: SeparatorOption[] = [
  { id: 'phrase_newLine', name: 'new line', value: '\n' },
  { id: 'phrase_semicolor', name: 'semicolon', value: ';' },
];

export const ExportTranslations = ({ translations, category }: ExportTranslationsProps) => {
  const [translationSeparator, setTranslationSeparator] = useState(TRANSLATION_SEPARATORS[0].value);
  const [phraseSeparator, setPhraseSeparator] = useState(PHRASE_SEPARATORS[0].value);

  const data = new Blob(
    translations.map(
      (translation) => `${translation.cz_translation}${translationSeparator} ${translation.ua_translation}${phraseSeparator}`,
    ),
    { type: 'text/plain' },
  );
  const downloadLink = window.URL.createObjectURL(data);
  const fileName = `${category}.txt`;
  return (
    <>
      <h2>Download phrases</h2>
      <h3>Separator between the phrase and translation</h3>

      {TRANSLATION_SEPARATORS.map((option) => (
        <>
          <input
            type="radio"
            id={option.id}
            name={'translationSeparator'}
            value={option.value}
            checked={translationSeparator === option.value}
            onChange={() => setTranslationSeparator(option.value)}
          />
          <label htmlFor={option.id} className="ml-2">
            {option.name} ({option.displayValue ?? option.value})
          </label>
          <br />
        </>
      ))}

      <h3>Separator between phrases</h3>

      {PHRASE_SEPARATORS.map((option) => (
        <>
          <input
            type="radio"
            id={option.id}
            name={'phraseSeparator'}
            value={option.value}
            checked={phraseSeparator === option.value}
            onChange={() => setPhraseSeparator(option.value)}
          />
          <label htmlFor={option.id} className="ml-2">
            {option.name} ({option.displayValue ?? option.value})
          </label>
          <br />
        </>
      ))}

      <div>
        <a download={fileName} href={downloadLink} className="underline cursor-pointer">
          <Button text="Download phrases" />
        </a>
      </div>
      <div>
        Obsah můžete pro své učely používat zdarma a bez omezení, šířit ho dál můžete jen za pomínek licence CC BY-NC 4.0
        https://creativecommons.org/licenses/by-nc/4.0/deed.cs
      </div>
    </>
  );
};
