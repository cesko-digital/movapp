import { DetailedHTMLProps, Fragment, InputHTMLAttributes, LabelHTMLAttributes, useState } from 'react';
import { Button } from 'components/basecomponents/Button';
import { Modal } from 'components/basecomponents/Modal';
import { useTranslation } from 'next-i18next';
import { useLanguage } from 'utils/useLanguageHook';
import { TiExport } from 'react-icons/ti';
import { Phrase } from '../../utils/getDataUtils';
import { TranslationId } from '../../utils/locales';

const PREVIEW_PHRASES_COUNT = 3;
const CUSTOM_SEPARATOR_MAX_LENGTH = 30;

interface ExportTranslationsProps {
  translations: Phrase[];
  categoryName: string;
  triggerLabel?: string;
}

interface SeparatorOption {
  id: string;
  nameTranslation: TranslationId;
  value: string;
  displayValue?: JSX.Element;
}

const TRANSLATION_SEPARATORS: SeparatorOption[] = [
  { id: 'transl_semicolon', nameTranslation: 'export_translations.semicolon', value: '; ' },
  { id: 'transl_comma', nameTranslation: 'export_translations.comma', value: ', ' },
  { id: 'trans_tab', nameTranslation: 'export_translations.tab', value: '\t', displayValue: <span>(&nbsp;&nbsp;&nbsp;&nbsp;)</span> },
];

const TRANS_SEP_CUSTOM = 'trans_custom';

const PHRASE_SEPARATORS: SeparatorOption[] = [
  { id: 'phrase_newLine', nameTranslation: 'export_translations.new_line', value: '\n', displayValue: <span></span> },
  { id: 'phrase_semicolon', nameTranslation: 'export_translations.semicolon', value: '; ' },
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

const ExportTranslations = ({ translations, categoryName, triggerLabel }: ExportTranslationsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translationSeparator, setTranslationSeparator] = useState<string>(TRANSLATION_SEPARATORS[0].value);
  const [customTranslationSeparator, setCustomTranslationSeparator] = useState<string>(' - ');
  const [phraseSeparator, setPhraseSeparator] = useState<string>(PHRASE_SEPARATORS[0].value);
  const [customPhraseSeparator, setCustomPhraseSeparator] = useState('\\n\\n');
  const [includeTranscriptions, setIncludeTranscriptions] = useState(false);
  const { currentLanguage, otherLanguage } = useLanguage();

  const translSep = translationSeparator === TRANS_SEP_CUSTOM ? customTranslationSeparator : translationSeparator;
  const phraseSep = phraseSeparator === PHRASE_SEP_CUSTOM ? customPhraseSeparator : phraseSeparator;
  const phrases = translations
    .map(
      (translation) =>
        translation.getTranslation(currentLanguage) +
        (includeTranscriptions ? ` [${translation.getTranscription(currentLanguage)}]` : '') +
        translSep +
        translation.getTranslation(otherLanguage) +
        (includeTranscriptions ? ` [${translation.getTranscription(otherLanguage)}]` : '') +
        phraseSep
    )
    .map((translation) => unescapeTabsAndNewlines(translation));

  // Byte order mark to force some browsers to read the file as UTF-8
  const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
  const data = new Blob([BOM, ...phrases], { type: 'text/plain;charset=utf8' });
  const downloadLink = window.URL.createObjectURL(data);
  const fileName = `${categoryName}.txt`;

  const { t } = useTranslation();

  return (
    <>
      <button className="cursor-pointer underline text-primary-blue inline-flex gap-x-1 items-center" onClick={() => setIsModalOpen(true)}>
        <TiExport className="w-5 h-5" />
        <span>{triggerLabel ?? t('export_translations.export_phrases')}</span>
      </button>
      <Modal closeModal={() => setIsModalOpen(false)} isOpen={isModalOpen} title={`${t('export_translations.export')} ${categoryName}`}>
        <p>{t('export_translations.subtitle_note')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div>
            <H3>{t('export_translations.between_phrase_and_translation')}:</H3>
            {TRANSLATION_SEPARATORS.map((option, index) => (
              <Fragment key={index}>
                <RadioButton
                  id={option.id}
                  name={'translationSeparator'}
                  value={option.value}
                  checked={translationSeparator === option.value}
                  onChange={() => setTranslationSeparator(option.value)}
                />
                <Label htmlFor={option.id}>
                  {t(option.nameTranslation)} {option.displayValue ?? `(${option.value})`}
                </Label>
                <br />
              </Fragment>
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
              <Fragment key={index}>
                <RadioButton
                  id={option.id}
                  name={'phraseSeparator'}
                  value={option.value}
                  checked={phraseSeparator === option.value}
                  onChange={() => setPhraseSeparator(option.value)}
                />
                <Label htmlFor={option.id}>
                  {t(option.nameTranslation)} {option.displayValue ?? `(${option.value})`}
                </Label>
                <br />
              </Fragment>
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
            name="include_transcriptions"
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
            <Button text={t('export_translations.download_phrases')} className="my-2 bg-primary-blue" />
          </a>
          <Button
            text={t('export_translations.copy_to_clipboard')}
            onClick={() => navigator.clipboard.writeText(phrases.join(''))}
            className="my-2 bg-primary-blue"
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

export default ExportTranslations;
