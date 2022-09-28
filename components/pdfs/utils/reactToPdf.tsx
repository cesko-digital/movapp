import { renderToStaticMarkup } from 'react-dom/server';
import pdf from 'html-pdf';
import { ReactElement } from 'react';

const PDF_OPTIONS: pdf.CreateOptions = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
  footer: {
    height: '10mm',
  },
  type: 'pdf',
  timeout: 30000,
};

export const componentToPDFBuffer = (component: ReactElement): Promise<Buffer> => {
  const html = renderToStaticMarkup(component);

  return new Promise((resolve, reject) => {
    pdf.create(html, PDF_OPTIONS).toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }
      return resolve(buffer);
    });
  });
};
