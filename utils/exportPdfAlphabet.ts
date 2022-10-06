// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

const exportPdf = async (path: string, filename: `${string}.pdf`) => {
  const HTMLcontent = fs.readFileSync(`.next/server/pages/${path}.html`, 'utf8');
  const CSSpath = '.next/static/css/';
  const CSSfiles: string[] = fs.readdirSync(CSSpath).filter((fn: any) => fn.endsWith('.css'));
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
    scale: 0.8,
    margin: {
      top: '10mm',
      left: '10mm',
      right: '10mm',
      bottom: '10mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div id="footer-template" style="font-size:10px !important; color:#808080; padding-left:10px;">Find more education content at Movapp.cz</div>',
  });
  await browser.close();
  console.log('PDF generated', filename);
};

exportPdf('cs/alphabet/pdf/uk', 'cs_ukAlphabet.pdf');
exportPdf('cs/alphabet/pdf/cs', 'cs_csAlphabet.pdf');

export {};
