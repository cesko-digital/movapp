import { renderToStaticMarkup } from 'react-dom/server';
import pdf from 'html-pdf';
import { ReactElement } from 'react';

const componentToPDFBuffer = (component: ReactElement) => {
  return new Promise((resolve, reject) => {
    const html = renderToStaticMarkup(component);

    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      footer: {
        height: '10mm',
      },
      type: 'pdf',
      timeout: 30000,
    } as const;

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        return reject(err);
      }

      return resolve(buffer);
    });
  });
};

export default {
  componentToPDFBuffer,
};
