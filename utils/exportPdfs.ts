import { getCountryVariant } from 'utils/locales';
/* eslint-disable no-console */
import { Language } from '../utils/locales';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

const FOOTER: Record<Language, string> = {
  cs: 'Více naučných materiálů naleznete na <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  sk: 'Viac náučných materiálov nájdete na <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  pl: 'Więcej materiałów edukacyjnych można znaleźć na stronie <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  uk: 'Ви можете знайти більше навчальних матеріалів на <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
};

const exportPdf = async (path: string, filename: `${string}.pdf`, footerLanguage: Language) => {
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
    footerTemplate: `<div id="footer-template" style="font-size:10px !important; color:#808080; padding-left:10px;">${FOOTER[footerLanguage]}</div>`,
  });
  await browser.close();
  console.log('PDF generated', filename);
};

if (getCountryVariant() === 'pl') {
  exportPdf('pl/alphabet/pdf/uk', 'sk_ukAlphabet.pdf', 'pl');
  exportPdf('pl/alphabet/pdf/pl', 'uk_plAlphabet.pdf', 'uk');
} else if (getCountryVariant() === 'sk') {
  exportPdf('sk/alphabet/pdf/uk', 'sk_ukAlphabet.pdf', 'sk');
  exportPdf('sk/alphabet/pdf/sk', 'uk_skAlphabet.pdf', 'uk');
} else {
  exportPdf('cs/alphabet/pdf/uk', 'cs_ukAlphabet.pdf', 'cs');
  exportPdf('cs/alphabet/pdf/cs', 'uk_csAlphabet.pdf', 'uk');
}
