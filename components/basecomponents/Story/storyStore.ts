import { Language } from 'utils/locales';

export type PhraseInfo = { language: Language; time: number };

export interface StoryPhrase {
  main: string;
  uk: string;
  start_cs: number;
  end_cs: number;
  start_uk: number;
  end_uk: number;
}

const STORY_SLUGS = [
  'zabi-princ',
  'pernikova-chaloupka',
  'dvanact-mesicku',
  'cervena-karkulka',
  'velika-repa',
  'tri-prasatka',
  'kolobok',
  'husy-lebedi',
  'ivasik-telesik',
];

export const getStoryData = async (language: Language, storySlug: string): Promise<StoryPhrase[]> => {
  if (!STORY_SLUGS.includes(storySlug)) {
    throw new Error(`Unknown story slug: ${storySlug}`);
  }

  try {
    const storyData = await import(`../../../data/translations/${language}/pohadka_${storySlug}.json`);
    return storyData.default;
  } catch (e) {
    console.info(`Story not available in this ${language}: ${storySlug}`);
    return [];
  }
};
