import { Translation, TranslationContainer } from 'components/basecomponents/TranslationsContainer';

interface CategoryDictionaryProps {
  translations: Translation[];
  searchText: string;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  player: HTMLAudioElement | null;
}

export const CategoryDictionary = ({ translations, setPlayer, player, searchText }: CategoryDictionaryProps): JSX.Element => {
  return (
    <>
      {translations.map((translation, index) => {
        return <TranslationContainer player={player} setPlayer={setPlayer} key={index} {...translation} searchText={searchText} />;
      })}
    </>
  );
};
