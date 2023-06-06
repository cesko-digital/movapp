import { Category } from 'utils/getDataUtils';

/* PROPS */
export type KidsDictionaryProps = {
  platform?: Platform;
};

export type KidsCategoryListProps = {
  kidsCategory: Category | undefined;
  platform?: Platform;
};

/* ENUMS */
export enum Platform {
  KIOSK = 'kiosk',
  WEB = 'web',
}
