import fs from 'fs';
import xml2js, { Builder, Parser } from 'xml2js';

import { UrlSet, UrlRecord } from '../lib/@types';

/**
 * Appends a new URL to the specified sitemap.xml file.
 *
 * @param {string} filePath - The file path of the sitemap.xml file.
 * @param {string} newUrl - The new URL to be appended to the sitemap.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 * @throws {Error} Throws an error if there is an issue reading or writing the sitemap.xml file.
 */
export const appendUrlToSitemap = async (filePath: string, newUrl: string): Promise<void> => {
  try {
    const xmlData = await fs.promises.readFile(filePath, 'utf-8');
    const parser: Parser = new xml2js.Parser();
    const builder: Builder = new xml2js.Builder();

    const parsedData = await parser.parseStringPromise(xmlData);
    const urlSet: UrlSet = parsedData.urlset;

    const newUrlRecord: UrlRecord = {
      loc: [newUrl],
      lastmod: [new Date().toISOString()],
    };

    urlSet.url.push(newUrlRecord);
    const updatedXml = builder.buildObject(parsedData);

    await fs.promises.writeFile(filePath, updatedXml, 'utf-8');

    console.log('URL appended successfully:', newUrl);
  } catch (error) {
    throw error;
  }
};
