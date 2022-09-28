import { NextPageContext } from 'next';
import React from 'react';
import Article from '../../components/pdfs/Article';
import pdfHelper from './pdfHelper';
import PDFLayout from './pdfLayout';

// import Article from '../components/Article';
// import PDFLayout from '../components/PDFLayout';
// import pdfHelper from '../lib/pdfHelper';

class PDF extends React.Component {
  static async getInitialProps({ req, res, query }: NextPageContext) {
    const exportPDF = query.exportPDF === 'true';
    const isServer = !!req;

    if (isServer && exportPDF && res) {
      const buffer = await pdfHelper.componentToPDFBuffer(
        <PDFLayout>
          <Article />
        </PDFLayout>
      );

      // with this header, your browser will prompt you to download the file
      // without this header, your browse will open the pdf directly
      res.setHeader('Content-disposition', 'attachment; filename="article.pdf');

      // set content type
      res.setHeader('Content-Type', 'application/pdf');

      // output the pdf buffer. once res.end is triggered, it won't trigger the render method
      res.end(buffer);
    }

    return {};
  }

  render() {
    return <Article />;
  }
}

export default PDF;
