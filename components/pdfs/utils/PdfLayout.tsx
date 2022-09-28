import React, { FunctionComponent } from 'react';

const PdfFooter: FunctionComponent = () => (
  <div
    id="pageFooter"
    style={{
      fontSize: '10px',
      color: '#666',
    }}
  >
    This is a sample footer
  </div>
);

const PdfLayout: FunctionComponent = ({ children }) => (
  <html>
    <head>
      <meta charSet="utf8" />
      <link rel="stylesheet" href="http://localhost:1234/static/pdf.css" />
    </head>
    <body>
      {children}
      <PdfFooter />
    </body>
  </html>
);

export default PdfLayout;
