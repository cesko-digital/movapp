import { Fragment, useState } from 'react';
import { Button } from '../basecomponents/Button';
import { Translation } from '../basecomponents/TranslationContainer';
import { Modal } from '../basecomponents/Modal';

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
  { id: 'trans_tab', name: 'tab', value: '    ', displayValue: <span>(&nbsp;&nbsp;&nbsp;&nbsp;)</span> },
];
const TRANS_SEP_CUSTOM = 'trans_custom';

const PHRASE_SEPARATORS: SeparatorOption[] = [
  { id: 'phrase_newLine', name: 'new line', value: '\n', displayValue: <span></span> },
  { id: 'phrase_semicolor', name: 'semicolon', value: ';' },
];
const PHRASE_SEP_CUSTOM = 'phrase_custom';

export const ExportTranslations = ({ translations, category }: ExportTranslationsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translationSeparator, setTranslationSeparator] = useState(TRANSLATION_SEPARATORS[0].value);
  const [customTranslationSeparator, setCustomTranslationSeparator] = useState('');
  const [phraseSeparator, setPhraseSeparator] = useState(PHRASE_SEPARATORS[0].value);
  const [customPhraseSeparator, setCustomPhraseSeparator] = useState('');

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const translSep = translationSeparator === TRANS_SEP_CUSTOM ? customTranslationSeparator : translationSeparator;
  const phraseSep = phraseSeparator === PHRASE_SEP_CUSTOM ? customPhraseSeparator : phraseSeparator;
  const data = new Blob(
    translations.map((translation) => `${translation.cz_translation}${translSep} ${translation.ua_translation}${phraseSep}`),
    { type: 'text/plain' },
  );
  const downloadLink = window.URL.createObjectURL(data);
  const fileName = `${category}.txt`;

  return (
    <>
      <Button onClick={openModal} text="Download phrases" className="my-6" />
      <Modal closeModal={closeModal} isOpen={isOpen} title={'Download phrases'}>
        <h3 className="my-4">Separator between the phrase and translation:</h3>

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
              {option.name} {option.displayValue ?? `(${option.value})`}
            </label>
            <br />
          </>
        ))}
        <input
          type="radio"
          id={TRANS_SEP_CUSTOM}
          name={'translationSeparator'}
          value={TRANS_SEP_CUSTOM}
          checked={translationSeparator === TRANS_SEP_CUSTOM}
          onChange={() => setTranslationSeparator(TRANS_SEP_CUSTOM)}
        />
        <label htmlFor={TRANS_SEP_CUSTOM} className="ml-2">
          Custom{' '}
          {translationSeparator === TRANS_SEP_CUSTOM && (
            <input
              type="text"
              maxLength={50}
              value={customTranslationSeparator}
              className="rounded-md md:rounded-lg py-1 px-3 text-dark-700 border-1 border-primary-blue outline-none shadow-s"
              onChange={(e) => setCustomTranslationSeparator(e.target.value)}
            ></input>
          )}
        </label>
        <br />

        <h3 className="my-4">Separator between phrases:</h3>

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
              {option.name} {option.displayValue ?? `(${option.value})`}
            </label>
            <br />
          </>
        ))}
        <input
          type="radio"
          id={PHRASE_SEP_CUSTOM}
          name={'phraseSeparator'}
          value={PHRASE_SEP_CUSTOM}
          checked={phraseSeparator === PHRASE_SEP_CUSTOM}
          onChange={() => setPhraseSeparator(PHRASE_SEP_CUSTOM)}
        />
        <label htmlFor={PHRASE_SEP_CUSTOM} className="ml-2">
          Custom{' '}
          {phraseSeparator === PHRASE_SEP_CUSTOM && (
            <input
              type="text"
              maxLength={50}
              value={customPhraseSeparator}
              className="rounded-md md:rounded-lg py-1 px-3 text-dark-700 border-1 border-primary-blue outline-none shadow-s"
              onChange={(e) => setCustomPhraseSeparator(e.target.value)}
            ></input>
          )}
        </label>
        <br />

        <div>
          <a download={fileName} href={downloadLink}>
            <Button text="Download phrases" className="my-6" />
          </a>
        </div>
        <div className="text-sm">
          Obsah můžete pro své učely používat zdarma a bez omezení, šířit ho dál můžete jen za pomínek licence CC BY-NC 4.0
          https://creativecommons.org/licenses/by-nc/4.0/deed.cs
        </div>
      </Modal>
    </>
  );
};
