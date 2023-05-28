import React, { forwardRef } from 'react';

interface MainTextProps {
  invisible?: boolean;
}

export const MainText = forwardRef<HTMLHeadingElement, MainTextProps & React.ReactNode>(({ invisible = false, children }, ref) => (
  <h5 ref={ref} className={`text-xl sm:text-2xl text-center p-0 ${invisible ? 'opacity-0' : ''}`}>
    {children}
  </h5>
));
