/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbsoluteFill, useVideoConfig, Audio, Sequence, useCurrentFrame } from 'remotion';
import { KidsTranslationsContainer } from 'components/basecomponents/KidsTranslationContainer';
import React, { useMemo } from 'react';
import { Phrase } from 'utils/getDataUtils';

interface KidsCompProps {
  translations: Phrase[];
}

const KidsCompOld = ({ translations }: KidsCompProps) => {
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

// interface CardProps {
//   phrase: Phrase;
// }

// const Card = ({ phrase }: CardProps) => (
//   <>
//     <KidsTranslationsContainer imageUrl={phrase.getImageUrl()} phrase={phrase} />
//     <Audio src={phrase.getSoundUrl('uk')} />
//   </>
// );

// const KidsComp = ({ translations }: KidsCompProps) => {
//   const { fps } = useVideoConfig();
//   const frame = useCurrentFrame();

//   const duration = fps * 3; // in seconds
//   const phrase = translations[Math.trunc(frame / duration)];

//   return (
//     <AbsoluteFill
//       style={{
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white',
//       }}
//     >
//       <Card phrase={phrase} />
//     </AbsoluteFill>
//   );
// };

export default KidsCompOld;
