import React, { DetailedHTMLProps, Fragment, InputHTMLAttributes, LabelHTMLAttributes, useState } from 'react';
import { Button } from '../basecomponents/Button';
import { Modal } from '../basecomponents/Modal';
import { useTranslation } from 'next-i18next';
import { Translation } from '../basecomponents/TranslationsContainer';

const PREVIEW_PHRASES_COUNT = 3;
const CUSTOM_SEPARATOR_MAX_LENGTH = 30;

interface ExportTranslationsProps {
  translations: Translation[];
  category: string;
}

interface SeparatorOption {
  id: string;
  nameKey: string;
  value: string;
  displayValue?: JSX.Element;
}

const TRANSLATION_SEPARATORS: SeparatorOption[] = [
  { id: 'transl_comma', nameKey: 'export_translations.comma', value: ', ' },
  { id: 'transl_semicolor', nameKey: 'export_translations.semicolon', value: '; ' },
  { id: 'trans_tab', nameKey: 'export_translations.tab', value: '\t', displayValue: <span>(&nbsp;&nbsp;&nbsp;&nbsp;)</span> },
];
const TRANS_SEP_CUSTOM = 'trans_custom';

const PHRASE_SEPARATORS: SeparatorOption[] = [
  { id: 'phrase_newLine', nameKey: 'export_translations.new_line', value: '\n', displayValue: <span></span> },
  { id: 'phrase_semicolor', nameKey: 'export_translations.semicolon', value: '; ' },
];
const PHRASE_SEP_CUSTOM = 'phrase_custom';

const unescapeTabsAndNewlines = (str: string) => str.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

const H3 = ({ ...props }: DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => (
  <h3 className="my-4" {...props} />
);
const RadioButton = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input type="radio" className="ml-3 inline-block my-2 cursor-pointer" {...props} />
);
const Label = ({ ...props }: LabelHTMLAttributes<HTMLLabelElement>) => <label className="pl-3 cursor-pointer" {...props} />;
const TextInput = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="text"
    maxLength={CUSTOM_SEPARATOR_MAX_LENGTH}
    className="rounded-md md:rounded-lg w-24 max-w-full px-2 text-dark-700 border-1 border-primary-blue outline-none shadow-s"
    {...props}
  />
);
const Checkbox = ({ ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className="ml-3 inline-block my-2 cursor-pointer" type="checkbox" {...props} />
);
const Separator = () => (
  <div className="pb-2">
    <div className="border-t w-full border-gray-300"></div>
  </div>
);

export const ExportTranslations = ({ translations, category }: ExportTranslationsProps) => {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translationSeparator, setTranslationSeparator] = useState(TRANSLATION_SEPARATORS[0].value);
  const [customTranslationSeparator, setCustomTranslationSeparator] = useState(' - ');
  const [phraseSeparator, setPhraseSeparator] = useState(PHRASE_SEPARATORS[0].value);
  const [customPhraseSeparator, setCustomPhraseSeparator] = useState('\\n\\n');
  const [includeTranscriptions, setIncludeTranscriptions] = useState(false);

  const translSep = translationSeparator === TRANS_SEP_CUSTOM ? customTranslationSeparator : translationSeparator;
  const phraseSep = phraseSeparator === PHRASE_SEP_CUSTOM ? customPhraseSeparator : phraseSeparator;
  const phrases = translations
    .map((translation) =>
      i18n.language === 'cz'
        ? translation.cz_translation +
          (includeTranscriptions ? ` [${translation.cz_transcription}]` : '') +
          translSep +
          translation.ua_translation +
          (includeTranscriptions ? ` [${translation.ua_transcription}]` : '') +
          phraseSep
        : translation.ua_translation +
          (includeTranscriptions ? ` [${translation.ua_transcription}]` : '') +
          translSep +
          translation.cz_translation +
          (includeTranscriptions ? ` [${translation.cz_transcription}]` : '') +
          phraseSep,
    )
    .map((translation) => unescapeTabsAndNewlines(translation));

  // Byte order mark to force some browsers to read the file as UTF-8
  const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const data = new Blob([BOM, ...phrases], { type: 'text/plain;charset=utf8' });
  const downloadLink = window.URL.createObjectURL(data);
  const fileName = `${category}.txt`;

  const { t } = useTranslation();

  return (
    <>
      <span onClick={() => setIsModalOpen(true)} className="cursor-pointer underline text-primary-blue ml-4 pb-4 inline-block">
        {t('export_translations.download_phrases')}
      </span>
      <Modal closeModal={() => setIsModalOpen(false)} isOpen={isModalOpen} title={t('export_translations.download_phrases')}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div>
            <H3>{t('export_translations.between_phrase_and_translation')}:</H3>
            {TRANSLATION_SEPARATORS.map((option, index) => (
              <React.Fragment key={index}>
                <RadioButton
                  id={option.id}
                  name={'translationSeparator'}
                  value={option.value}
                  checked={translationSeparator === option.value}
                  onChange={() => setTranslationSeparator(option.value)}
                />
                <Label htmlFor={option.id}>
                  {t(option.nameKey)} {option.displayValue ?? `(${option.value})`}
                </Label>
                <br />
              </React.Fragment>
            ))}
            <RadioButton
              id={TRANS_SEP_CUSTOM}
              name={'translationSeparator'}
              value={TRANS_SEP_CUSTOM}
              checked={translationSeparator === TRANS_SEP_CUSTOM}
              onChange={() => setTranslationSeparator(TRANS_SEP_CUSTOM)}
            />
            <Label htmlFor={TRANS_SEP_CUSTOM}>
              {t('export_translations.custom')}
              {translationSeparator === TRANS_SEP_CUSTOM && (
                <>
                  <span>:&nbsp;&nbsp;&nbsp;</span>
                  <TextInput value={customTranslationSeparator} onChange={(e) => setCustomTranslationSeparator(e.target.value)} />
                </>
              )}
            </Label>
          </div>
          <div>
            <H3>{t('export_translations.between_phrases')}:</H3>
            {PHRASE_SEPARATORS.map((option, index) => (
              <React.Fragment key={index}>
                <RadioButton
                  id={option.id}
                  name={'phraseSeparator'}
                  value={option.value}
                  checked={phraseSeparator === option.value}
                  onChange={() => setPhraseSeparator(option.value)}
                />
                <Label htmlFor={option.id}>
                  {t(option.nameKey)} {option.displayValue ?? `(${option.value})`}
                </Label>
                <br />
              </React.Fragment>
            ))}
            <RadioButton
              id={PHRASE_SEP_CUSTOM}
              name={'phraseSeparator'}
              value={PHRASE_SEP_CUSTOM}
              checked={phraseSeparator === PHRASE_SEP_CUSTOM}
              onChange={() => setPhraseSeparator(PHRASE_SEP_CUSTOM)}
            />
            <Label htmlFor={PHRASE_SEP_CUSTOM}>
              {t('export_translations.custom')}
              {phraseSeparator === PHRASE_SEP_CUSTOM && (
                <>
                  <span>:&nbsp;&nbsp;&nbsp;</span>
                  <TextInput value={customPhraseSeparator} onChange={(e) => setCustomPhraseSeparator(e.target.value)} />
                </>
              )}
            </Label>
            <br />
          </div>
        </div>
        <div>
          <H3>{t('export_translations.transcriptions')}: </H3>
          <Checkbox
            id="include_transcriptions"
            name="vehicle1"
            checked={includeTranscriptions}
            onChange={() => setIncludeTranscriptions(!includeTranscriptions)}
          />
          <Label htmlFor="include_transcriptions">{t('export_translations.include_transcriptions')}</Label>
        </div>

        <h3 className="my-4">{t('export_translations.preview')}:</h3>
        <div className="bg-gray-100 border-1 border-gray-400 p-2">
          <code className="whitespace-pre-wrap">{phrases.slice(0, PREVIEW_PHRASES_COUNT)}</code>
        </div>

        <div className="flex justify-evenly flex-wrap py-8">
          <a download={fileName} href={downloadLink}>
            <Button text={t('export_translations.download_phrases')} className="my-2" />
          </a>
          <Button
            text={t('export_translations.copy_to_clipboard')}
            onClick={() => navigator.clipboard.writeText(phrases.join(''))}
            className="my-2 bg-white"
          ></Button>
        </div>
        <Separator />
        <div className="text-sm font-light">
          {t('export_translations.sharing_info')}:&nbsp;
          <a href="https://creativecommons.org/licenses/by-nc/4.0/deed.cs" target="_blank" rel="noreferrer" className="underline">
            CC BY-NC 4.0
          </a>
          .
        </div>
      </Modal>
    </>
  );
};
