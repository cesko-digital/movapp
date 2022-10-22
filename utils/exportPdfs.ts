/* eslint-disable no-console */
import { CountryVariant } from './locales';
import { fetchDictionary } from './getDataUtils';
import { Language, getCountryVariant } from '../utils/locales';
import fs from 'fs';
import puppeteer from 'puppeteer';

/** This script is meant to run after build (as specified in package.json.scripts.postbuild) to generate PDFs from specific pages.
 * This approach was adopted from https://harrisonpim.com/blog/creating-a-downloadable-pdf-copy-of-a-page-using-next-js-and-puppeteer
 * Thanks a lot, Harrison!
 */

/** The PFD footer is localized but otherwise common for all PDFs for now */
const FOOTER: Record<Language, string> = {
  cs: 'Více naučných materiálů naleznete na <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  sk: 'Viac náučných materiálov nájdete na <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  pl: 'Więcej materiałów edukacyjnych można znaleźć na stronie <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
  uk: 'Ви можете знайти більше навчальних матеріалів на <a style="color: blue;" href="movapp.eu">www.movapp.eu</a>',
};

/**
 * Turns a page into a PDF file and saves it inside the `public/pdf` folder. Must run AFTER the site is built.
 * @param path Route of the Next.js page you want to save as PDF. Must include the locale at the beginning (even if it is the default one)
 * @param filename The name of the generated PDF file.
 * @param footerLanguage Language of the footer
 */
const exportPdf = async (path: string, filename: `${string}.pdf`, footerLanguage: Language) => {
  // Grab generated HTML
  const HTMLcontent = fs.readFileSync(`.next/server/pages/${path}.html`, 'utf8');
  // Include fonts at the beginning, then compile all generated CSS
  let CSScontent = "@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;1,100&display=swap');";
  const CSSpath = '.next/static/css/';
  const CSSfiles = fs.readdirSync(CSSpath).filter((fileName) => fileName.endsWith('.css'));
  CSSfiles.forEach((file) => {
    CSScontent += fs.readFileSync(CSSpath + file, 'utf8');
  });

  // Launch headless browser and export the page to PDF
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
    footerTemplate: `<div id="footer-template" style="font-size:10px !important; color:#808080; padding-left:35px;">${FOOTER[footerLanguage]}</div>`,
  });
  await browser.close();
  console.log('PDF generated', filename);
};

const generateAlphabetPdfs = (country: CountryVariant) => {
  // For each language variant, specify which pages you want to generate:
  if (country === 'pl') {
    exportPdf('pl/alphabet/pdf/uk', 'ukAlphabet.pdf', 'pl');
    exportPdf('uk/alphabet/pdf/pl', 'plAlphabet.pdf', 'uk');
  } else if (country === 'sk') {
    exportPdf('sk/alphabet/pdf/uk', 'ukAlphabet.pdf', 'sk');
    exportPdf('uk/alphabet/pdf/sk', 'skAlphabet.pdf', 'uk');
  } else {
    exportPdf('cs/alphabet/pdf/uk', 'ukAlphabet.pdf', 'cs');
    exportPdf('uk/alphabet/pdf/cs', 'csAlphabet.pdf', 'uk');
  }
};

const generateDictionaryPdfs = async (country: CountryVariant) => {
  const categories = (await fetchDictionary()).categories;
  for (const category of categories) {
    exportPdf(`${country}/dictionary/pdf/${category.id}`, `${category.name.main}.pdf`, country);
  }
};

const main = async () => {
  try {
    const country = getCountryVariant();
    generateAlphabetPdfs(country);
    await generateDictionaryPdfs(country);
  } catch (error) {
    console.log(error);
  }
};

// Script starts from here
main();
