import React, { forwardRef } from 'react';

export interface CircleStyle {
  color: string;
  isBig: boolean;
  position: string;
}

export const ChristmasBannerCircleComponent = forwardRef((props: CircleStyle): JSX.Element => {
  return (
    <span
      className={'rounded-full absolute' + props.isBig ? 'w-[20px] h-[20px]' : 'w-[12px] h-[12px]' + `bg-[${props.color}]` + props.position}
    ></span>
  );
});
