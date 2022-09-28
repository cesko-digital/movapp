import React, { FunctionComponent } from 'react';

const renderPDFFooter = () => (
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

const PDFLayout: FunctionComponent = ({ children }) => (
  <html>
    <head>
      <meta charSet="utf8" />
      <link rel="stylesheet" href="http://localhost:1234/static/pdf.css" />
    </head>
    <body>
      {children}
      {renderPDFFooter()}
    </body>
  </html>
);

export default PDFLayout;
