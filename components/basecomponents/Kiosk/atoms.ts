import { atom } from 'jotai';
import { Platform } from '@types';

export const dictionaryAudioPlayAtom = atom(false);
export const dictionaryActivePhraseAtom = atom('');

export const currentPlatformAtom = atom(Platform.WEB);
