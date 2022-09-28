import React, { FunctionComponent } from 'react';

const PdfFooter: FunctionComponent = () => (
  <div
    id="pageFooter"
    style={{
      fontSize: '10px',
      color: '#666',
    }}
  >
    Další učební materiály najdete na Movapp.cz
  </div>
);

const PdfLayout: FunctionComponent = ({ children }) => (
  <html>
    {/* It seems the Tailwind link only works with native html head */}
    {/* eslint-disable-next-line @next/next/no-head-element */}
    <head>
      <meta charSet="utf8" />
      <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"></link>
    </head>
    <body style={{ fontSize: '12px' }}>
      {children}
      <PdfFooter />
    </body>
  </html>
);

export default PdfLayout;
