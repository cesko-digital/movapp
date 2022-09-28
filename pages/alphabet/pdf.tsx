import { NextPageContext } from 'next';
import React from 'react';
import AlphabetPdf from '../../components/pdfs/alphabetPdf';
import { componentToPDFBuffer } from '../../components/pdfs/utils/reactToPdf';
import PdfLayout from '../../components/pdfs/utils/PdfLayout';

class PDF extends React.Component {
  static async getInitialProps({ res }: NextPageContext) {
    // const exportPDF = query.exportPDF === 'true';
    // const isServer = !!req;

    if (res) {
      const buffer = await componentToPDFBuffer(
        <PdfLayout>
          <AlphabetPdf title={'Alphabet'} />
        </PdfLayout>
      );

      // with this header, your browser will prompt you to download the file
      // without this header, your browse will open the pdf directly
      // res.setHeader('Content-disposition', 'attachment; filename="article.pdf');

      // set content type
      res.setHeader('Content-Type', 'application/pdf');

      // output the pdf buffer. once res.end is triggered, it won't trigger the render method
      res.end(buffer);
    }
  }
}

export default PDF;
