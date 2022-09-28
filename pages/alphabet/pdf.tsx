import { NextPageContext } from 'next';
import React from 'react';
import AlphabetPdf from '../../components/pdfs/alphabetPdf';
import { componentToPDFBuffer } from '../../components/pdfs/utils/reactToPdf';
import PdfLayout from '../../components/pdfs/utils/PdfLayout';
import { fetchAlphabetMain, fetchAlphabetUk } from '../../utils/getDataUtils';

class PDF extends React.Component {
  static async getInitialProps({ res }: NextPageContext) {
    // const exportPDF = query.exportPDF === 'true';
    // const isServer = !!req;

    const alphabetMain = await fetchAlphabetMain();
    const alphabetUk = await fetchAlphabetUk();
    // const localeTranslations = await getServerSideTranslations(locale);

    if (res) {
      const buffer = await componentToPDFBuffer(
        <PdfLayout>
          <AlphabetPdf title={'Alphabet'} alphabetMain={alphabetMain} alphabetUk={alphabetUk} />
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
