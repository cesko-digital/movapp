import PlayIcon from 'public/icons/play.svg';
import Marker from 'react-mark.js/Marker';
import { Language } from 'data/locales';
import { AudioPlayer } from 'components/utils/AudioPlayer';
import { useTranslation } from 'next-i18next';

interface TranslationProps {
  translation: string;
  transcription: string;
  language: Language;
  searchText: string;
}

export const Translation = ({ transcription, translation, language, searchText }: TranslationProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center py-2 px-5 bg-primary-grey">
      <div className="w-full">
        <p className="translation_text self-start w-full ">
          {/* Marker is used to highlight searched text */}
          <Marker mark={searchText}>{translation}</Marker>
        </p>
        <p className="text-gray-500">{`[ ${transcription} ]`}</p>
      </div>
      <button
        onClick={() => AudioPlayer.getInstance().playTextToSpeech(translation, language)}
        aria-label={t('utils.play') + ' ' + translation}
      >
        <PlayIcon className="cursor-pointer active:scale-75  stroke-red-500 w-8" />
      </button>
    </div>
  );
};
