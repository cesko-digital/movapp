import React, { forwardRef } from 'react';

interface MainTextProps {
  invisible?: boolean;
  clasName?: string;
}

export const MainText = forwardRef<HTMLHeadingElement, MainTextProps & React.ReactNode>(({ clasName = '', children }, ref) => (
  <h5 ref={ref} className={`text-xl sm:text-2xl text-center p-0 ${clasName}`}>
    {children}
  </h5>
));
