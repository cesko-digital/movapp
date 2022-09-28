import { NextPageContext } from 'next';
import React from 'react';
import AlphabetPdf from '../../components/pdfs/alphabetPdf';
import { componentToPDFBuffer } from '../../components/pdfs/utils/reactToPdf';
import PdfLayout from '../../components/pdfs/utils/PdfLayout';
import { AlphabetDataObject, fetchAlphabetMain, fetchAlphabetUk } from '../../utils/getDataUtils';
import { Language } from '../../utils/locales';
import { rest } from 'cypress/types/lodash';

class PDF extends React.Component {
  static async getInitialProps({ res, query, locale }: NextPageContext) {
    let alphabet: AlphabetDataObject;
    if (query.alphabet === 'uk') {
      alphabet = await fetchAlphabetUk();
    } else {
      alphabet = await fetchAlphabetMain();
    }

    if (res) {
      try {
        const buffer = await componentToPDFBuffer(
          <PdfLayout>
            <AlphabetPdf locale={locale as Language} alphabet={alphabet} />
          </PdfLayout>
        );

        // with this header, your browser will prompt you to download the file
        // without this header, your browse will open the pdf directly
        res.setHeader('Content-disposition', 'attachment; filename="article.pdf');

        // set content type
        res.setHeader('Content-Type', 'application/pdf');

        // output the pdf buffer. once res.end is triggered, it won't trigger the render method
        res.end(buffer);
      } catch (e) {
        console.log(e);
        res.end({ error: e });
      }
    }
  }
}

export default PDF;
