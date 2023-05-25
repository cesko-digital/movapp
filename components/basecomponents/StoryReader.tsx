import React from 'react';
import PlayIcon from '../../public/icons/stories-play.svg';
import PauseIcon from '../../public/icons/stories-pause.svg';
import StopIcon from '../../public/icons/stories-stop.svg';
import { getCountryVariant, Language } from '../../utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { Flag } from './Flag';
import StoryText from './StoryText';
import { useStoryReader } from 'components/hooks/useStoryReader';
import { Trans } from 'next-i18next';

interface StoryReaderProps {
  titleCurrent: string;
  titleOther: string;
  id: string;
  country: string;
}

const StoryReader = ({ titleCurrent, titleOther, id }: StoryReaderProps): JSX.Element => {
  const { currentLanguage } = useLanguage();
  const { audio, languagePlay, setLanguagePlay, setSeekValue, seekValue, stopStory, isPlaying, pauseStory, playStory, time, playPhrase } =
    useStoryReader(id);

  const handleLanguageChange = (language: Language) => {
    playPhrase({ language: language, time: audio.current?.currentTime ?? 0 });
    setLanguagePlay(language);
  };

  const locales = ['uk' as Language, getCountryVariant()];

  return (
    <div className="w-full">
      <div className="controls">
        <div className="flex items-center justify-between">
          <h2 className="p-0 m-0 text-sm sm:text-base md:text-xl">
            {titleCurrent} / {titleOther}
          </h2>
          <div className={`flex items-center ${currentLanguage !== 'uk' ? 'flex-row-reverse' : 'flex-row'}`}>
            {locales.map((local) => (
              <button
                key={local}
                onClick={() => {
                  handleLanguageChange(local);
                }}
              >
                <Flag
                  language={local}
                  width={27}
                  height={27}
                  className={`ml-3 ease-in-out duration-300 ${local === languagePlay && 'scale-125'}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex">
            <button onClick={() => (isPlaying ? pauseStory() : playStory())}>
              {isPlaying ? (
                <PauseIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="50" height="50" />
              ) : (
                <PlayIcon className="cursor-pointer active:scale-75 transition-all duration-300 mr-1.5" width="50" height="50" />
              )}
            </button>
            <button onClick={() => stopStory()}>
              <StopIcon className="cursor-pointer active:scale-75 transition-all duration-300" width="50" height="50" />
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full ml-2 mr-2"
            step="1"
            value={seekValue}
            onChange={(e) => {
              const seekTo = audio.current !== null ? audio.current.duration * (Number(e.target.value) / 100) : 0;
              audio.current !== null ? (audio.current.currentTime = seekTo) : null;
              setSeekValue(Number(e.target.value));
            }}
          />
          <p className="text-xl text-right">{time}</p>
        </div>
      </div>
      <p className="text-base md:text-md mt-4">
        <Trans
          i18nKey={'kids_page.downloadStory'}
          components={[
            <a
              key="download PDF"
              className="underline text-primary-blue"
              href={`/pdf/${id}-${currentLanguage}.pdf`}
              rel="noreferrer"
              target="_blank"
            />,
          ]}
        />
      </p>
      <div className={`flex ${currentLanguage !== 'uk' ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
        {locales.map((local) => (
          <StoryText
            key={local}
            audio={audio.current}
            textLanguage={local}
            onClick={(value) => {
              playPhrase(value);
              setLanguagePlay(local);
            }}
            audioLanguage={languagePlay}
            id={id}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryReader;
