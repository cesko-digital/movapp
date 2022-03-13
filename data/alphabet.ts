export interface ExampleType {
  example: string;
  translation: string;
}

interface AlphabetType {
  main_letter: [string, string];
  letter_transcription: [string, string];
  examples: [ExampleType, ExampleType, ExampleType];
}

export const CZ_ALPHABET: AlphabetType[] = [
  {
    main_letter: ['A', 'a'],
    letter_transcription: ['A', 'a'],
    examples: [
      {
        example: 'abeceda',
        translation: 'алфавіт',
      },
      {
        example: 'ananas',
        translation: 'ананас',
      },
      {
        example: 'autobus',
        translation: 'автобув',
      },
    ],
  },
  {
    main_letter: ['B', 'b'],
    letter_transcription: ['Б', 'б'],
    examples: [
      {
        example: 'březen',
        translation: 'березень',
      },
      {
        example: 'brambory',
        translation: 'картопля',
      },
      {
        example: 'břicho',
        translation: 'живіт',
      },
    ],
  },
  {
    main_letter: ['C', 'c'],
    letter_transcription: ['Ц', 'ц'],
    examples: [
      {
        example: 'cibule',
        translation: 'цибуля',
      },
      {
        example: 'církev',
        translation: 'церква',
      },
      {
        example: 'cítron',
        translation: 'лимон',
      },
    ],
  },
  {
    main_letter: ['Č', 'č'],
    letter_transcription: ['Ч', 'ч'],
    examples: [
      {
        example: 'čepice',
        translation: 'кепка',
      },
      {
        example: 'čokoloada',
        translation: 'шоколад',
      },
      {
        example: 'čekat',
        translation: 'чекати',
      },
    ],
  },
  {
    main_letter: ['D', 'd'],
    letter_transcription: ['Д', 'д'],
    examples: [
      {
        example: 'dům',
        translation: 'дім',
      },
      {
        example: 'děkuji',
        translation: 'дякую',
      },
      {
        example: 'dnes',
        translation: 'сьогодні',
      },
    ],
  },
  {
    main_letter: ['E', 'e'],
    letter_transcription: ['E', 'e'],
    examples: [
      {
        example: 'elektrikář',
        translation: 'електрик',
      },
      {
        example: 'emigrace',
        translation: 'еміграція',
      },
      {
        example: 'euro',
        translation: 'євро',
      },
    ],
  },
  {
    main_letter: ['Ě', 'ě'],
    letter_transcription: ['Є', 'є'],
    examples: [
      {
        example: 'elektrikář',
        translation: 'електрик',
      },
      {
        example: 'emigrace',
        translation: 'еміграція',
      },
      {
        example: 'euro',
        translation: 'євро',
      },
    ],
  },
  // {
  //   main_letter: ['ř', 'ř'],
  //   letter_transcription: ['РЖ', 'рж'],
  //   examples: [
  //     {
  //       example: 'elektrikář',
  //       translation: 'електрик',
  //     },
  //     {
  //       example: 'emigrace',
  //       translation: 'еміграція',
  //     },
  //     {
  //       example: 'euro',
  //       translation: 'євро',
  //     },
  //   ],
  // },
];
