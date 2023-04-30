import fs from 'fs';
import path from 'path';
import { appendUrlToSitemap } from '../sitemapUtils';

const mockSitemapPath = path.join(__dirname, './mocks/sitemap.xml');
const testSitemapPath = path.join(__dirname, './mocks/test-sitemap.xml');

beforeEach(() => {
  fs.copyFileSync(mockSitemapPath, testSitemapPath);
});

afterEach(() => {
  fs.unlinkSync(testSitemapPath);
});

describe('appendUrlToSitemap', () => {
  it('should append a new URL to the sitemap', async () => {
    const newUrl = 'https://example.com/new-url';

    await appendUrlToSitemap(testSitemapPath, newUrl);

    const updatedSitemapContent = fs.readFileSync(testSitemapPath, 'utf-8');
    expect(updatedSitemapContent).toContain(`<loc>${newUrl}</loc>`);
  });

  it('should throw an error if the sitemap file is not found', async () => {
    const invalidPath = 'non-existent-path/sitemap.xml';
    const newUrl = 'https://example.com/new-url';

    await expect(appendUrlToSitemap(invalidPath, newUrl)).rejects.toThrowError();
  });
});
