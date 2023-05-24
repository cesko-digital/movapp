import {
  parseCategory,
  getCategories,
  getAllPhrases,
  getKidsCategory,
  getPhraseById,
  fetchDictionary,
  CategoryDataObject,
  DictionaryDataObject,
  PhraseDataObject,
  Phrase,
  KIDS_CATEGORY_ID,
} from '../getDataUtils';
import { CountryVariant } from '../locales';
import fetch, { Response } from 'node-fetch';

jest.mock('node-fetch');

// Create mock data for testing

const mockCountryVariantCZ: CountryVariant = 'cs';

const mockPhraseData: PhraseDataObject = {
  id: 'testPhrase',
  main: {
    sound_url: 'https://example.com/sound.mp3',
    translation: 'translation',
    transcription: 'transcription',
  },
  source: {
    sound_url: 'https://example.com/sound_source.mp3',
    translation: 'translation_source',
    transcription: 'transcription_source',
  },
  image_url: 'https://example.com/image.jpg',
};

const mockCategoryData: CategoryDataObject = {
  id: 'testCategory',
  name: {
    source: 'categoryNameSource',
    main: 'categoryNameMain',
  },
  description: 'description',
  phrases: ['testPhrase'],
  hidden: true,
  metacategories: [],
};

const mockDictionaryData: DictionaryDataObject = {
  source: 'uk',
  main: mockCountryVariantCZ,
  categories: [mockCategoryData],
  phrases: { testPhrase: mockPhraseData },
};

describe('Get Data Utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseCategory', () => {
    it('should parse a CategoryDataObject into a Category', () => {
      const parsedCategory = parseCategory(mockCategoryData, mockDictionaryData);

      expect(parsedCategory.id).toEqual(mockCategoryData.id);
      expect(parsedCategory.nameMain).toEqual(mockCategoryData.name.main);
      expect(parsedCategory.nameUk).toEqual(mockCategoryData.name.source);
      expect(parsedCategory.translations[0].getId()).toEqual(mockPhraseData.id);
    });
  });

  describe('getCategories', () => {
    it('should return an array of Category objects', () => {
      const categories = getCategories(mockDictionaryData);
      expect(categories.length).toEqual(mockDictionaryData.categories.length);
      expect(categories[0].id).toEqual(mockCategoryData.id);
    });
  });

  describe('getAllPhrases', () => {
    it('should return an array of Phrase objects', () => {
      const phrases = getAllPhrases(mockDictionaryData);
      expect(phrases.length).toEqual(mockDictionaryData.categories.length);
      expect(phrases[0].getId()).toEqual(mockPhraseData.id);
    });
  });

  describe('getKidsCategory', () => {
    it('should return the kids category if present', () => {
      const kidsCategoryData = { ...mockCategoryData, id: KIDS_CATEGORY_ID };
      const kidsDictionaryData = { ...mockDictionaryData, categories: [kidsCategoryData] };
      const kidsCategory = getKidsCategory(kidsDictionaryData);
      expect(kidsCategory).toBeDefined();
      expect(kidsCategory?.id).toEqual(kidsCategoryData.id);
    });

    it('should return undefined if the kids category is not present', () => {
      const kidsCategory = getKidsCategory(mockDictionaryData);
      expect(kidsCategory).toBeUndefined();
    });
  });

  describe('getPhraseById', () => {
    it('should return a Phrase object with the given id', () => {
      const phrase = getPhraseById(mockDictionaryData, 'testPhrase');
      expect(phrase.getId()).toEqual(mockPhraseData.id);
    });
  });

  describe('Phrase', () => {
    const phrase = new Phrase(mockPhraseData);

    it('should return correct translations', () => {
      expect(phrase.getTranslation('uk')).toEqual(mockPhraseData.source.translation);
      expect(phrase.getTranslation(mockCountryVariantCZ)).toEqual(mockPhraseData.main.translation);
    });

    it('should return correct transcriptions', () => {
      expect(phrase.getTranscription('uk')).toEqual(mockPhraseData.source.transcription);
      expect(phrase.getTranscription(mockCountryVariantCZ)).toEqual(mockPhraseData.main.transcription);
    });

    it('should return correct sound URLs', () => {
      expect(phrase.getSoundUrl('uk')).toEqual(mockPhraseData.source.sound_url);
      expect(phrase.getSoundUrl(mockCountryVariantCZ)).toEqual(mockPhraseData.main.sound_url);
    });

    it('should return the correct image URL', () => {
      expect(phrase.getImageUrl()).toEqual(mockPhraseData.image_url);
    });

    it('should return the correct ID', () => {
      expect(phrase.getId()).toEqual(mockPhraseData.id);
    });
  });

  // Test fetching functions
  describe('fetching functions', () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    it('should fetch dictionary data with hidden categories filtered out', async () => {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockDictionaryData),
      } as unknown as Response);

      const dictionaryData = await fetchDictionary(mockCountryVariantCZ);
      expect(dictionaryData.categories.length).toEqual(0);
    });
  });
});
