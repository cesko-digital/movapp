/*
  Do not forget to import all *.json files ../data/translations and included them into sections array.
  I have no idea how to do it automatically. Let's do it manually.
 */

import Basic from '../data/translations/basic.json';
import UzitecneFraze from '../data/translations/uzitecne-fraze.json';
import Cas from '../data/translations/cas.json';
import HromadnaDoprava from '../data/translations/hromadna-doprava.json';
import Zoo from '../data/translations/zoo.json';
import NaNakupu from '../data/translations/na-nakupu.json';
import NaUrade from '../data/translations/na-urade.json';
import ObleceniDrogerie from '../data/translations/obleceni-drogerie.json';
import Penize from '../data/translations/penize.json';
import Rodina from '../data/translations/rodina.json';
import Doctor from '../data/translations/doctor.json';
import VDomacnosti from '../data/translations/vdomacnosti.json';
import VeMeste from '../data/translations/vemeste.json';
import VeSkole from '../data/translations/veskole.json';
import VeSkolce from '../data/translations/veskolce.json';

const sections = [
  Basic,
  UzitecneFraze,
  Cas,
  HromadnaDoprava,
  Zoo,
  NaNakupu,
  NaUrade,
  ObleceniDrogerie,
  Penize,
  Rodina,
  Doctor,
  VDomacnosti,
  VeMeste,
  VeSkole,
  VeSkolce,
];

test('Check all required attributes in dictionary', () => {
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

export {};
