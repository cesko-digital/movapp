import { AbsoluteFill, useVideoConfig, Audio, Sequence } from 'remotion';
import { KidsTranslationsContainer } from 'components/basecomponents/KidsTranslationContainer';
import React, { useMemo } from 'react';
import { Phrase } from 'utils/getDataUtils';

interface KidsCompProps {
  translations: Phrase[];
}

const KidsComp = ({ translations }: KidsCompProps) => {
  const { fps } = useVideoConfig();

  const duration = fps * 3; // in seconds

  const sequenceList = useMemo(
    () =>
      translations.map((phrase, i) => {
        return (
          <Sequence key={phrase.getTranslation('uk')} from={i * duration} durationInFrames={(i + 1) * duration}>
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}
            >
              <KidsTranslationsContainer imageUrl={phrase.getImageUrl()} phrase={phrase} />
              <Audio src={phrase.getSoundUrl('uk')} />
            </AbsoluteFill>
          </Sequence>
        );
      }),
    [translations, duration]
  );

  return <>{sequenceList}</>;
};

export default KidsComp;
