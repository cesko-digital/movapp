// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

const exportPdf = async (/** @type {string} */ path, /** @type {`${string}.pdf` } */ filename) => {
  const HTMLcontent = fs.readFileSync(`.next/server/pages/${path}.html`, 'utf8');
  const CSSpath = '.next/static/css/';
  const CSSfiles = fs.readdirSync(CSSpath).filter((fn) => fn.endsWith('.css'));
  let CSScontent = '';
  CSSfiles.forEach((file) => {
    CSScontent += fs.readFileSync(CSSpath + file, 'utf8');
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.setContent(HTMLcontent, {
    waitUntil: ['networkidle0'],
  });
  await page.addStyleTag({ content: CSScontent });
  await page.evaluateHandle('document.fonts.ready');

  await page.pdf({
    path: `public/pdf/${filename}`,
    format: 'A4',
    scale: 0.67,
    margin: {
      top: '10mm',
      left: '10mm',
      right: '10mm',
      bottom: '10mm',
    },
  });
  await browser.close();
  console.log('PDF generated', filename);
};

exportPdf('cs/alphabet', 'csAlphabet.pdf');
