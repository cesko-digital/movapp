import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { primitive } from 'typescript-json-decoder/dist/types';
import { TranslationJSON } from './Phrase';

/**
 * You can use this utility script to migrate translation JSON files into a new structure
 * Run the script like this: npx ts-node --skip-project  ./utils/migrateDictionaryJSONs.ts
 * Format files after script runs: npx prettier --write ./data/translations/migrated/
 */

// Define source folder:
const dir = 'data/translations/SK';
// Define target folder inside source folder:
const migratedDir = 'migrated';
// Define how to map old JSON object to new ones
const transformFunction = (oldPhrase: Record<string, string>) => ({
  main: oldPhrase.cz_translation,
  uk: oldPhrase.ua_translation,
  image: oldPhrase.image,
});

// Filepath helper method
const getNewFilePath = (oldFilePath: string) => {
  const pathSplit = oldFilePath.split('/');
  pathSplit.push(`${migratedDir}/${pathSplit.pop()}`);
  const newPath = pathSplit.join('/');
  return newPath;
};

// Main method
const migrate = (dir: string, migratedDir: string, transformFunction: (old: TranslationJSON) => Record<string, primitive>) => {
  // Get files
  const dirEntries = readdirSync(dir, { withFileTypes: true });
  const filesPaths = dirEntries
    .filter((entry) => entry.isFile)
    .map((entry) => resolve(dir, entry.name))
    .filter((filePath) => filePath.endsWith('.json'));

  // Create 'migrated' folder if it does not exist
  const migratedDirPath = `${dir}/${migratedDir}`;
  if (!existsSync(migratedDirPath)) {
    mkdirSync(migratedDirPath);
  }

  for (const path of filesPaths) {
    const newPath = getNewFilePath(path);
    const translations = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));
    const migratedTranslations = translations.map(transformFunction);
    writeFileSync(newPath, JSON.stringify(migratedTranslations));
  }
};

migrate(dir, migratedDir, transformFunction);
