import { createContext } from 'react';
import { Phrase } from 'utils/getDataUtils';

export const PhrasesContext = createContext<Phrase[]>([] as Phrase[]);
