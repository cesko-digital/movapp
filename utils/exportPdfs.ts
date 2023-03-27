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

/**
 * NOTE: Dynamically loading the country from env variables here (inside a post-build script) work fine in Vercel
 * but not locally. If you need to locally test generating PDFs of other language variants, hard-code that value here like this
 * const COUNTRY: CountryVariant = "sk"
 * To-do: Figure out how to properly load env variables here, `dotenv` does not seem to work.
 */
const COUNTRY = getCountryVariant();

const WEB_LINK: Record<CountryVariant, string> = {
  cs: '<a style="color: blue;" href="https://movapp.cz">www.movapp.cz</a>',
  sk: '<a style="color: blue;" href="https://sk.movapp.eu/">sk.movapp.eu</a>',
  pl: '<a style="color: blue;" href="https://pl.movapp.eu">pl.movapp.eu</a>',
};

const MOVAPP_TAGLINE: Record<Language, string> = {
  cs: `Více naučných materiálů naleznete na ${WEB_LINK['cs']}. Vygenerováno dne`,
  sk: `Viac náučných materiálov nájdete na ${WEB_LINK['sk']}. Vygenerované dňa`,
  pl: `Więcej materiałów edukacyjnych można znaleźć na stronie ${WEB_LINK['pl']}. Wygenerowany w dniu`,
  uk: `Ви можете знайти більше навчальних матеріалів на ${WEB_LINK[COUNTRY]}. Згенеровано на`,
};

/**
 * Turns a page into a PDF file and saves it inside the `public/pdf` folder. Must run AFTER the site is built.
 * @param path Route of the Next.js page you want to save as PDF. Must include the locale at the beginning (even if it is the default one)
 * @param filename The name of the generated PDF file.
 * @param footerLanguage Language of the footer
 */
const exportPdf = async (path: string, filename: `${string}.pdf`, footerLanguage: Language, footerTitle?: string) => {
  // Grab generated HTML
  const HTMLcontent = fs.readFileSync(`.next/server/pages/${path}.html`, 'utf8');
  // Include fonts and disable color printing strategy at the beginning, then compile all generated CSS
  let CSScontent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;1,100&display=swap');
    html {
      -webkit-print-color-adjust: exact;
    }
  `;
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
  const todayDate = new Date();
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
      bottom: '20mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div 
        id="footer-template" 
        style="font-size:9px !important;
          color:#808080;
          padding-left:35px;
          padding-right:35px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;"
      >
      <div>${MOVAPP_TAGLINE[footerLanguage]} ${todayDate.getDate()}.${todayDate.getMonth() + 1}.${todayDate.getFullYear()}</div>
        <div>  
          <b>${footerTitle ?? ''}</b>           
          <span class="pageNumber"></span>
          /
          <span class="totalPages"></span>
      </div>`,
  });
  await browser.close();
  console.log('PDF generated', filename);
};

const generateAlphabetPDFs = async (country: CountryVariant) => {
  exportPdf(`${country}/alphabet/pdf/uk`, `ukAlphabet.pdf`, country);
  exportPdf(`uk/alphabet/pdf/${country}`, `${country}Alphabet.pdf`, 'uk');
};

const generateDictionaryPDFs = async (country: CountryVariant) => {
  const categories = (await fetchDictionary(country)).categories;
  for (const category of categories) {
    exportPdf(`${country}/dictionary/pdf/${category.id}`, `${category.name.main}.pdf`, country, category.name.main);
    exportPdf(`uk/dictionary/pdf/${category.id}`, `${category.name.source}.pdf`, 'uk', category.name.source);
  }
};

const main = async () => {
  try {
    generateAlphabetPDFs(COUNTRY);
    generateDictionaryPDFs(COUNTRY);
  } catch (error) {
    console.log(error);
  }
};

// Silence EventEmitter memory warning https://github.com/puppeteer/puppeteer/issues/594 for now
// Running exports sequentially would fix it but be 10x slower
process.setMaxListeners(100);
// Script starts from here
main();
