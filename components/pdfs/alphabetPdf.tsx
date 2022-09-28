/* eslint-disable @next/next/no-img-element */

import { FunctionComponent } from 'react';
import { AlphabetDataObject } from '../../utils/getDataUtils';
import { Language } from '../../utils/locales';
import { translateInPdf } from './utils/pdfTranslations';

type Props = {
  alphabet: AlphabetDataObject;
  locale: Language;
};

const AlphabetPdf: FunctionComponent<Props> = ({ alphabet, locale }) => {
  return (
    <div>
      <h1 className={'text-3xl'}>{translateInPdf(locale, `alphabet_page.${alphabet.source}.name`)}</h1>
      <p className="italic">{translateInPdf(locale, `alphabet_page.${alphabet.source}.description`)}</p>
      {alphabet.data.map(({ id, letters, transcription, examples }) => (
        <p key={id} className={'mt-5'}>
          {letters.join(', ')} {transcription}
          {examples.map((example) => `${example.translation} [${example.transcription}],`)}
        </p>
      ))}
    </div>
  );
};

export default AlphabetPdf;
