import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

/** Return a flat array of all files under given directory */
const getFilesRecursively = (dir: string): string[] => {
  let found: string[] = [];
  const dirents = readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const path = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      found = found.concat(getFilesRecursively(path));
    } else {
      found.push(path);
    }
  }
  return found;
};

const loadAllSections = (dir: string): Record<string, string>[][] => {
  return getFilesRecursively(dir)
    .filter((path) => path.endsWith('.json'))
    .map((path) => readFileSync(path, { encoding: 'utf-8' }))
    .map((text) => JSON.parse(text));
};

test('Check all required attributes in dictionary', () => {
  const sections = loadAllSections('data/translations');
  for (const section of sections) {
    for (const dictItem of section) {
      expect(dictItem).toEqual(
        expect.objectContaining({
          cz_translation: expect.stringMatching(/^.+$/),
          cz_transcription: expect.any(String),
          ua_translation: expect.stringMatching(/^.+$/),
          ua_transcription: expect.any(String),
        }),
      );
    }
  }
});
