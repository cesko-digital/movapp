import React, { forwardRef } from 'react';
import Link from 'next/link';

export interface ChristmasBannerItemProps {
  header: string;
  description: string;
  link: string;
}

export const ChristmasBannerItem = forwardRef((props: ChristmasBannerItemProps): JSX.Element => {
  return (
    <div className="max-w-4xl pt-4 pb-4 max-w-[258px]">
      <Link href={props.link}>
        <h4 className="text-[20px] leading-[23px] sm:text-[16px] sm:leading-[19px] font-bold text-white">{props.header}</h4>
        <hr className="h-[3px] w-[48px] bg-[#FAD741] mb-3 mt-3" />
        <div className="text-[14px] leading-[16px] text-white">{props.description}</div>
      </Link>
    </div>
  );
});
