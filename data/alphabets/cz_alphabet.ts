export interface ExampleType {
  example: string;
  example_transcription: string;
}

export interface Letter {
  letter: [string, string | null];
  transcription: string;
  examples: [ExampleType, ExampleType, ExampleType];
}

export const ALPHABET_CZ: Letter[] = [
  {
    letter: ['A', 'a'],
    transcription: '[a]',
    examples: [
      {
        example: 'abeceda',
        example_transcription: 'абецеда'
      },
      {
        example: 'ananas',
        example_transcription: 'ананас'
      },
      {
        example: 'autobus',
        example_transcription: 'аутобус'
      }
    ]
  },
  {
    letter: ['Á', 'á'],
    transcription: 'довгий [a]',
    examples: [
      {
        example: 'káva',
        example_transcription: 'кава'
      },
      {
        example: 'kráva',
        example_transcription: 'крава'
      },
      {
        example: 'máma',
        example_transcription: 'мама'
      }
    ]
  },
  {
    letter: ['B', 'b'],
    transcription: '[б]',
    examples: [
      {
        example: 'balón',
        example_transcription: 'балон'
      },
      {
        example: 'brambory',
        example_transcription: 'брамбори'
      },
      {
        example: 'banán',
        example_transcription: 'банан'
      }
    ]
  },
  {
    letter: ['C', 'c'],
    transcription: '[ц]',
    examples: [
      {
        example: 'cibule',
        example_transcription: 'цибуле'
      },
      {
        example: 'cop',
        example_transcription: 'цоп'
      },
      {
        example: 'citron',
        example_transcription: 'цитрон'
      }
    ]
  },
  {
    letter: ['Č', 'č'],
    transcription: '[ч]',
    examples: [
      {
        example: 'čepice',
        example_transcription: 'чепице'
      },
      {
        example: 'čokoláda',
        example_transcription: 'чоколада'
      },
      {
        example: 'červený',
        example_transcription: 'червени'
      }
    ]
  },
  {
    letter: ['D', 'd'],
    transcription: '[д]',
    examples: [
      {
        example: 'dům',
        example_transcription: 'дум'
      },
      {
        example: 'datel',
        example_transcription: 'дател'
      },
      {
        example: 'dopis',
        example_transcription: 'допис'
      }
    ]
  },
  {
    letter: ['Ď', 'ď'],
    transcription: '[дь]',
    examples: [
      {
        example: 'ďábel',
        example_transcription: 'дябел'
      },
      {
        example: 'děti',
        example_transcription: 'дєті'
      },
      {
        example: 'hodiny',
        example_transcription: 'годіни'
      }
    ]
  },
  {
    letter: ['E', 'e'],
    transcription: '[e]',
    examples: [
      {
        example: 'elektrikář',
        example_transcription: 'електрикарж'
      },
      {
        example: 'Evropa',
        example_transcription: 'Европа'
      },
      {
        example: 'emu',
        example_transcription: 'ему'
      }
    ]
  },
  {
    letter: ['É', 'é'],
    transcription: 'довгий [е]',
    examples: [
      {
        example: 'lékárna',
        example_transcription: 'лекарна'
      },
      {
        example: 'jméno',
        example_transcription: 'ймено'
      },
      {
        example: 'létat',
        example_transcription: 'летат'
      }
    ]
  },
  {
    letter: ['ě', null],
    transcription: "[є] (читаємо попередній приголосний м'яко)",
    examples: [
      {
        example: 'kotě',
        example_transcription: 'котє'
      },
      {
        example: 'měkký',
        example_transcription: 'мнєки'
      },
      {
        example: 'něco',
        example_transcription: 'нєцо'
      }
    ]
  },
  {
    letter: ['F', 'f'],
    transcription: '[ф]',
    examples: [
      {
        example: 'fyzika',
        example_transcription: 'физика'
      },
      {
        example: 'fronta',
        example_transcription: 'фронта'
      },
      {
        example: 'flétna',
        example_transcription: 'флетна'
      }
    ]
  },
  {
    letter: ['G', 'g'],
    transcription: '[ґ]',
    examples: [
      {
        example: 'garáž',
        example_transcription: 'ґараж'
      },
      {
        example: 'gramofon',
        example_transcription: 'ґрамофон'
      },
      {
        example: 'gymnastika',
        example_transcription: 'ґимнастика'
      }
    ]
  },
  {
    letter: ['H', 'h'],
    transcription: '[г]',
    examples: [
      {
        example: 'hlava',
        example_transcription: 'глава'
      },
      {
        example: 'houba',
        example_transcription: 'гоуба'
      },
      {
        example: 'harmonika',
        example_transcription: 'гармоника'
      }
    ]
  },
  {
    letter: ['Ch', null],
    transcription: '[х]',
    examples: [
      {
        example: 'chléb',
        example_transcription: 'хлеп'
      },
      {
        example: 'chobotnice',
        example_transcription: 'хоботніце'
      },
      {
        example: 'chameleon',
        example_transcription: 'хамелеон'
      }
    ]
  },
  {
    letter: ['I', 'i'],
    transcription: '[i]',
    examples: [
      {
        example: 'internet',
        example_transcription: 'интернет'
      },
      {
        example: 'indián',
        example_transcription: 'индиян'
      },
      {
        example: 'iglů',
        example_transcription: 'иґлу'
      }
    ]
  },
  {
    letter: ['Í', 'í'],
    transcription: 'довгий [i]',
    examples: [
      {
        example: 'lípa',
        example_transcription: 'ліпа'
      },
      {
        example: 'papír',
        example_transcription: 'папір'
      },
      {
        example: 'písmeno',
        example_transcription: 'пісмено'
      }
    ]
  },
  {
    letter: ['J', 'j'],
    transcription: '[й]',
    examples: [
      {
        example: 'jablko',
        example_transcription: 'яблко'
      },
      {
        example: 'jahoda',
        example_transcription: 'ягода'
      },
      {
        example: 'ježek',
        example_transcription: 'єжек'
      }
    ]
  },
  {
    letter: ['K', 'k'],
    transcription: '[к]',
    examples: [
      {
        example: 'kočka',
        example_transcription: 'кочка'
      },
      {
        example: 'kobliha',
        example_transcription: 'коблига'
      },
      {
        example: 'kaktus',
        example_transcription: 'кактус'
      }
    ]
  },
  {
    letter: ['L', 'l'],
    transcription: '[л]',
    examples: [
      {
        example: 'láska',
        example_transcription: 'ласка'
      },
      {
        example: 'lampa',
        example_transcription: 'лампа'
      },
      {
        example: 'lev',
        example_transcription: 'леф'
      }
    ]
  },
  {
    letter: ['M', 'm'],
    transcription: '[м]',
    examples: [
      {
        example: 'mléko',
        example_transcription: 'млеко'
      },
      {
        example: 'metro',
        example_transcription: 'метро'
      },
      {
        example: 'maska',
        example_transcription: 'маска'
      }
    ]
  },
  {
    letter: ['N', 'n'],
    transcription: '[н]',
    examples: [
      {
        example: 'noviny',
        example_transcription: 'новини'
      },
      {
        example: 'nula',
        example_transcription: 'нула'
      },
      {
        example: 'nos',
        example_transcription: 'нос'
      }
    ]
  },
  {
    letter: ['Ň', 'ň'],
    transcription: 'нь',
    examples: [
      {
        example: 'kůň',
        example_transcription: 'кунь'
      },
      {
        example: 'báseň',
        example_transcription: 'басень'
      },
      {
        example: 'sáňky',
        example_transcription: 'саньки'
      }
    ]
  },
  {
    letter: ['O', 'o'],
    transcription: '[о]',
    examples: [
      {
        example: 'olej',
        example_transcription: 'олей'
      },
      {
        example: 'opice',
        example_transcription: 'опице'
      },
      {
        example: 'ovoce',
        example_transcription: 'овоце'
      }
    ]
  },
  {
    letter: ['Ó', 'ó'],
    transcription: '[о]',
    examples: [
      {
        example: 'gól',
        example_transcription: 'ґол'
      },
      {
        example: 'móda',
        example_transcription: 'мода'
      },
      {
        example: 'tón',
        example_transcription: 'тон'
      }
    ]
  },
  {
    letter: ['P', 'p'],
    transcription: '[п]',
    examples: [
      {
        example: 'peníze',
        example_transcription: 'пенізе'
      },
      {
        example: 'Praha',
        example_transcription: 'Прага'
      },
      {
        example: 'penál',
        example_transcription: 'пенал'
      }
    ]
  },
  {
    letter: ['Q', 'q'],
    transcription: '[кв]',
    examples: [
      {
        example: 'Quido',
        example_transcription: 'Квідо'
      },
      {
        example: 'squat',
        example_transcription: 'сквот'
      },
      {
        example: 'aquapark',
        example_transcription: 'аквапарк'
      }
    ]
  },
  {
    letter: ['R', 'r'],
    transcription: '[р]',
    examples: [
      {
        example: 'ryba',
        example_transcription: 'риба'
      },
      {
        example: 'ruka',
        example_transcription: 'рука'
      },
      {
        example: 'růže',
        example_transcription: 'руже'
      }
    ]
  },
  {
    letter: ['Ř', 'ř'],
    transcription: '[рж]',
    examples: [
      {
        example: 'Řím',
        example_transcription: 'Ржім'
      },
      {
        example: 'řízek',
        example_transcription: 'ржізек'
      },
      {
        example: 'řeka',
        example_transcription: 'ржека'
      }
    ]
  },
  {
    letter: ['S', 's'],
    transcription: '[с]',
    examples: [
      {
        example: 'socha',
        example_transcription: 'соха'
      },
      {
        example: 'sova',
        example_transcription: 'сова'
      },
      {
        example: 'stůl',
        example_transcription: 'стул'
      }
    ]
  },
  {
    letter: ['Š', 'š'],
    transcription: '[ш]',
    examples: [
      {
        example: 'šéf',
        example_transcription: 'шеф'
      },
      {
        example: 'šaty',
        example_transcription: 'шати'
      },
      {
        example: 'šnek',
        example_transcription: 'шнек'
      }
    ]
  },
  {
    letter: ['T', 't'],
    transcription: '[т]',
    examples: [
      {
        example: 'televize',
        example_transcription: 'телевизе'
      },
      {
        example: 'táta',
        example_transcription: 'тата'
      },
      {
        example: 'tráva',
        example_transcription: 'трава'
      }
    ]
  },
  {
    letter: ['Ť', 'ť'],
    transcription: '[ть]',
    examples: [
      {
        example: 'ťukat',
        example_transcription: 'тюкат'
      },
      {
        example: 'poušť',
        example_transcription: 'поушть'
      },
      {
        example: 'déšť',
        example_transcription: 'дешть'
      }
    ]
  },
  {
    letter: ['U', 'u'],
    transcription: '[у]',
    examples: [
      {
        example: 'Ukrajina',
        example_transcription: 'Україна'
      },
      {
        example: 'ucho',
        example_transcription: 'ухо'
      },
      {
        example: 'ulita',
        example_transcription: 'улита'
      }
    ]
  },
  {
    letter: ['Ú', 'ú'],
    transcription: 'довгий [у] на початку слова',
    examples: [
      {
        example: 'účtenka',
        example_transcription: 'учтенка'
      },
      {
        example: 'úl',
        example_transcription: 'ул'
      },
      {
        example: 'úkol',
        example_transcription: 'укол'
      }
    ]
  },
  {
    letter: ['ů', null],
    transcription: 'довгий [у] в середині слова',
    examples: [
      {
        example: 'kůň',
        example_transcription: 'кунь'
      },
      {
        example: 'schůzka',
        example_transcription: 'схуска'
      },
      {
        example: 'průkazka',
        example_transcription: 'прукаска'
      }
    ]
  },
  {
    letter: ['V', 'v'],
    transcription: '[в]',
    examples: [
      {
        example: 'voda',
        example_transcription: 'вода'
      },
      {
        example: 'vejce',
        example_transcription: 'вейце'
      },
      {
        example: 'vlk',
        example_transcription: 'влк'
      }
    ]
  },
  {
    letter: ['W', 'w'],
    transcription: '[в]',
    examples: [
      {
        example: 'workoholik',
        example_transcription: 'воркоголик'
      },
      {
        example: 'wifi',
        example_transcription: 'вифи'
      },
      {
        example: 'WC',
        example_transcription: 'ве це'
      }
    ]
  },
  {
    letter: ['X', 'x'],
    transcription: '[кс]',
    examples: [
      {
        example: 'lux',
        example_transcription: 'лукс'
      },
      {
        example: 'boxer',
        example_transcription: 'боксер'
      },
      {
        example: 'xylofon',
        example_transcription: 'ксилофон'
      }
    ]
  },
  {
    letter: ['Y', 'y'],
    transcription: '[и]',
    examples: [
      {
        example: 'ženy',
        example_transcription: 'жени'
      },
      {
        example: 'lyže',
        example_transcription: 'лиже'
      },
      {
        example: 'myš',
        example_transcription: 'миш'
      }
    ]
  },
  {
    letter: ['ý', null],
    transcription: 'довгий [и]',
    examples: [
      {
        example: 'sýr',
        example_transcription: 'сир'
      },
      {
        example: 'sýkorka',
        example_transcription: 'сикорка'
      },
      {
        example: 'mlýn',
        example_transcription: 'млин'
      }
    ]
  },
  {
    letter: ['Z', 'z'],
    transcription: '[з]',
    examples: [
      {
        example: 'zub',
        example_transcription: 'зуп'
      },
      {
        example: 'zebra',
        example_transcription: 'зебра'
      },
      {
        example: 'zvon',
        example_transcription: 'звон'
      }
    ]
  },
  {
    letter: ['Ž', 'ž'],
    transcription: '[ж]',
    examples: [
      {
        example: 'žena',
        example_transcription: 'жена'
      },
      {
        example: 'žárovka',
        example_transcription: 'жарофка'
      },
      {
        example: 'želva',
        example_transcription: 'желва'
      }
    ]
  }
];
