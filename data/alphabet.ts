export interface ExampleType {
  example: string;
  translation: string;
}

interface AplhabetType {
  cz_letter: [string, string | null];
  ua_transcription: string;
  examples: ExampleType[];
}

export const ALPHABET_CZ: AplhabetType[] = [
  {
    cz_letter: ['A', 'a'],
    ua_transcription: '[a]',
    examples: [
      {
        example: 'abeceda',
        translation: 'абецеда',
      },
      {
        example: 'ananas',
        translation: 'ананас',
      },
      {
        example: 'autobus',
        translation: 'аутобус',
      },
    ],
  },
  {
    cz_letter: ['á', null],
    ua_transcription: 'довгий [a]',
    examples: [
      {
        example: 'káva',
        translation: 'кава',
      },
      {
        example: 'kráva',
        translation: 'крава',
      },
      {
        example: 'plavání',
        translation: 'плавані',
      },
    ],
  },
  {
    cz_letter: ['B', 'b'],
    ua_transcription: '[б]',
    examples: [
      {
        example: 'březen',
        translation: 'бржезен',
      },
      {
        example: 'brambory',
        translation: 'брамбори',
      },
      {
        example: 'břicho',
        translation: 'бржіхо',
      },
    ],
  },
  {
    cz_letter: ['C', 'c'],
    ua_transcription: '[ц]',
    examples: [
      {
        example: 'cibule',
        translation: 'цібуле',
      },
      {
        example: 'církev',
        translation: 'ціркев',
      },
      {
        example: 'citron',
        translation: 'цітрон',
      },
    ],
  },
  {
    cz_letter: ['Č', 'č'],
    ua_transcription: '[ч]',
    examples: [
      {
        example: 'čepice',
        translation: 'чепіце',
      },
      {
        example: 'čokoláda',
        translation: 'чоколада',
      },
      {
        example: 'čekat',
        translation: 'чекат',
      },
    ],
  },
  {
    cz_letter: ['D', 'd'],
    ua_transcription: '[д]',
    examples: [
      {
        example: 'dům',
        translation: 'дум',
      },
      {
        example: 'děkuji',
        translation: 'дєкуї',
      },
      {
        example: 'dnes',
        translation: 'днес',
      },
    ],
  },
  {
    cz_letter: ['Ď', 'ď'],
    ua_transcription: '[дь]',
    examples: [
      {
        example: 'ďábel',
        translation: 'дябел',
      },
      {
        example: 'zeď',
        translation: 'зедь',
      },
      {
        example: 'loď',
        translation: 'лодь',
      },
    ],
  },
  {
    cz_letter: ['E', 'e'],
    ua_transcription: '[e]',
    examples: [
      {
        example: 'elektrikář',
        translation: 'електрікарж',
      },
      {
        example: 'emigrace',
        translation: 'еміґраце',
      },
      {
        example: 'euro',
        translation: 'еуро',
      },
    ],
  },
  {
    cz_letter: ['É', 'é'],
    ua_transcription: 'довгий [е]',
    examples: [
      {
        example: 'lékárna',
        translation: 'лекарна',
      },
      {
        example: 'jméno',
        translation: 'ймено',
      },
      {
        example: 'délka',
        translation: 'делка',
      },
    ],
  },
  {
    cz_letter: ['ě', null],
    ua_transcription: "[є] (читаємо попередній приголосний м'яко)",
    examples: [
      {
        example: 'kotě',
        translation: 'котє',
      },
      {
        example: 'měkký',
        translation: 'мнєккі',
      },
      {
        example: 'něco',
        translation: 'нєцо',
      },
    ],
  },
  {
    cz_letter: ['F', 'f'],
    ua_transcription: '[ф]',
    examples: [
      {
        example: 'fyzika',
        translation: 'фізіка',
      },
      {
        example: 'fronta',
        translation: 'фронта',
      },
      {
        example: 'faktura',
        translation: 'фактура',
      },
    ],
  },
  {
    cz_letter: ['G', 'g'],
    ua_transcription: '[ґ]',
    examples: [
      {
        example: 'garáž',
        translation: 'ґараж',
      },
      {
        example: 'program',
        translation: 'проґрам',
      },
      {
        example: 'agrese',
        translation: 'аґресе',
      },
    ],
  },
  {
    cz_letter: ['H', 'h'],
    ua_transcription: '[г]',
    examples: [
      {
        example: 'hlava',
        translation: 'глава',
      },
      {
        example: 'hodit se',
        translation: 'годіт се',
      },
      {
        example: 'hluk',
        translation: 'глук',
      },
    ],
  },
  {
    cz_letter: ['Ch', null],
    ua_transcription: '[х]',
    examples: [
      {
        example: 'míchat',
        translation: 'мішати',
      },
      {
        example: 'chování',
        translation: 'ховані',
      },
      {
        example: 'porucha',
        translation: 'поруха',
      },
    ],
  },
  {
    cz_letter: ['I', 'i'],
    ua_transcription: '[i]',
    examples: [
      {
        example: 'internet',
        translation: 'інтернет',
      },
      {
        example: 'integrace',
        translation: 'інтеґраце',
      },
      {
        example: 'introvert',
        translation: 'інтроверт',
      },
    ],
  },
  {
    cz_letter: ['í', null],
    ua_transcription: 'довгий [i]',
    examples: [
      {
        example: 'unikátní',
        translation: 'унікатні',
      },
      {
        example: 'papír',
        translation: 'папір',
      },
      {
        example: 'písmeno',
        translation: 'пісмено',
      },
    ],
  },
  {
    cz_letter: ['J', 'j'],
    ua_transcription: '[й]',
    examples: [
      {
        example: 'jablko',
        translation: 'яблко',
      },
      {
        example: 'játra',
        translation: 'ятра',
      },
      {
        example: 'jet',
        translation: 'єт',
      },
    ],
  },
  {
    cz_letter: ['K', 'k'],
    ua_transcription: '[к]',
    examples: [
      {
        example: 'květina',
        translation: 'квєтіна',
      },
      {
        example: 'kobliha',
        translation: 'кобліга',
      },
      {
        example: 'kousek',
        translation: 'коусек',
      },
    ],
  },
  {
    cz_letter: ['L', 'l'],
    ua_transcription: '[л]',
    examples: [
      {
        example: 'láska',
        translation: 'ласка',
      },
      {
        example: 'levný',
        translation: 'левни',
      },
      {
        example: 'látka',
        translation: 'латка',
      },
    ],
  },
  {
    cz_letter: ['M', 'm'],
    ua_transcription: '[м]',
    examples: [
      {
        example: 'mléko',
        translation: 'млеко',
      },
      {
        example: 'metro',
        translation: 'метро',
      },
      {
        example: 'milovat',
        translation: 'міловат',
      },
    ],
  },
  {
    cz_letter: ['N', 'n'],
    ua_transcription: '[н]',
    examples: [
      {
        example: 'noviny',
        translation: 'новіни',
      },
      {
        example: 'nula',
        translation: 'нула',
      },
      {
        example: 'ne',
        translation: 'не',
      },
    ],
  },
  {
    cz_letter: ['O', 'o'],
    ua_transcription: '[о]',
    examples: [
      {
        example: 'olej',
        translation: 'олей',
      },
      {
        example: 'lopata',
        translation: 'лопата',
      },
      {
        example: 'ležet',
        translation: 'лежет',
      },
    ],
  },
  {
    cz_letter: ['ó', null],
    ua_transcription: '[о]',
    examples: [
      {
        example: 'gól',
        translation: 'ґол',
      },
      {
        example: 'móda',
        translation: 'мода',
      },
      {
        example: 'tón',
        translation: 'тон',
      },
    ],
  },
  {
    cz_letter: ['P', 'p'],
    ua_transcription: '[п]',
    examples: [
      {
        example: 'peníze',
        translation: 'пенізе',
      },
      {
        example: 'Praha',
        translation: 'Прага',
      },
      {
        example: 'popisek',
        translation: 'попісек',
      },
    ],
  },
  {
    cz_letter: ['Q', 'q'],
    ua_transcription: '[кв]',
    examples: [
      {
        example: 'Quido',
        translation: 'квідо',
      },
      {
        example: 'squat',
        translation: 'сквод',
      },
      {
        example: 'aquapark',
        translation: 'аквапарк',
      },
    ],
  },
  {
    cz_letter: ['R', 'r'],
    ua_transcription: '[р]',
    examples: [
      {
        example: 'ryba',
        translation: 'риба',
      },
      {
        example: 'ruka',
        translation: 'рука',
      },
      {
        example: 'pravda',
        translation: 'правда',
      },
    ],
  },
  {
    cz_letter: ['Ř', 'ř'],
    ua_transcription: '[рж]',
    examples: [
      {
        example: 'Řím',
        translation: 'ржім',
      },
      {
        example: 'řízení',
        translation: 'ржізені',
      },
      {
        example: 'řeka',
        translation: 'ржека',
      },
    ],
  },
  {
    cz_letter: ['S', 's'],
    ua_transcription: '[с]',
    examples: [
      {
        example: 'socha',
        translation: 'соха',
      },
      {
        example: 'starat se',
        translation: 'старат се',
      },
      {
        example: 'stůl',
        translation: 'стул',
      },
    ],
  },
  {
    cz_letter: ['Š', 'š'],
    ua_transcription: '[ш]',
    examples: [
      {
        example: 'šéf',
        translation: 'шеф',
      },
      {
        example: 'šaty',
        translation: 'шати',
      },
      {
        example: 'školení',
        translation: 'школені',
      },
    ],
  },
  {
    cz_letter: ['T', 't'],
    ua_transcription: '[т]',
    examples: [
      {
        example: 'televize',
        translation: 'телевізе',
      },
      {
        example: 'táta',
        translation: 'тата',
      },
      {
        example: 'tři',
        translation: 'тржи',
      },
    ],
  },
  {
    cz_letter: ['Ť', 'ť'],
    ua_transcription: '[ть]',
    examples: [
      {
        example: 'ťukat',
        translation: 'тюкат',
      },
      {
        example: 'poušť',
        translation: 'поушть',
      },
      {
        example: 'poleť',
        translation: 'полеть',
      },
    ],
  },
  {
    cz_letter: ['U', 'u'],
    ua_transcription: '[у]',
    examples: [
      {
        example: 'Ukrajina',
        translation: 'україна',
      },
      {
        example: 'uhel',
        translation: 'угел',
      },
      {
        example: 'udělat',
        translation: 'удєлат',
      },
    ],
  },
  {
    cz_letter: ['Ú', 'ú'],
    ua_transcription: 'довгий [у] на початку слова',
    examples: [
      {
        example: 'účtenka',
        translation: 'учтенка',
      },
      {
        example: 'úrok',
        translation: 'урок',
      },
      {
        example: 'úspěch',
        translation: 'успєх',
      },
    ],
  },
  {
    cz_letter: ['ů', null],
    ua_transcription: 'довгий [у] в середині слова',
    examples: [
      {
        example: 'kůň',
        translation: 'кунь',
      },
      {
        example: 'schůzka',
        translation: 'схузка',
      },
      {
        example: 'průkazka',
        translation: 'пруказка',
      },
    ],
  },
  {
    cz_letter: ['V', 'v'],
    ua_transcription: '[в]',
    examples: [
      {
        example: 'voda',
        translation: 'вода',
      },
      {
        example: 'vejce',
        translation: 'вейце',
      },
      {
        example: 'vlk',
        translation: 'влк',
      },
    ],
  },
  {
    cz_letter: ['W', 'w'],
    ua_transcription: '[в]',
    examples: [
      {
        example: 'workoholik',
        translation: 'воркоголік',
      },
      {
        example: 'Waldemar',
        translation: 'валдемар',
      },
      {
        example: 'WC',
        translation: 'вц',
      },
    ],
  },
  {
    cz_letter: ['X', 'x'],
    ua_transcription: '[кс]',
    examples: [
      {
        example: 'xenofobie',
        translation: 'ксенофобіє',
      },
      {
        example: 'xerox',
        translation: 'ксерокс',
      },
      {
        example: 'xylofon',
        translation: 'ксилофон',
      },
    ],
  },
  {
    cz_letter: ['Y', 'y'],
    ua_transcription: '[и]',
    examples: [
      {
        example: 'ženy',
        translation: 'жени',
      },
      {
        example: 'levný',
        translation: 'левни',
      },
      {
        example: 'pracovitý',
        translation: 'працовіти',
      },
    ],
  },
  {
    cz_letter: ['Ý', 'ý'],
    ua_transcription: 'довгий [и]',
    examples: [
      {
        example: 'sýr',
        translation: 'сір',
      },
      {
        example: 'měkký',
        translation: 'мнєккі',
      },
      {
        example: 'tvrdý',
        translation: 'тврди',
      },
    ],
  },
  {
    cz_letter: ['Z', 'z'],
    ua_transcription: '[з]',
    examples: [
      {
        example: 'zub',
        translation: 'зуб',
      },
      {
        example: 'zvonit',
        translation: 'звоніт',
      },
      {
        example: 'zákon',
        translation: 'закон',
      },
    ],
  },
  {
    cz_letter: ['Ž', 'ž'],
    ua_transcription: '[ж]',
    examples: [
      {
        example: 'žena',
        translation: 'жена',
      },
      {
        example: 'žárovka',
        translation: 'жаровка',
      },
      {
        example: 'žádost',
        translation: 'жадост',
      },
    ],
  },
];
