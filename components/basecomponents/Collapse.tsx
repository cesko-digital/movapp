import React, { useState } from 'react';
import ChevronDown from '../../public/icons/chevron-down.svg';

interface CollapseProps {
  title: string;
  children: React.ReactNode;
}

export const Collapse = ({ title, children }: CollapseProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="shadow-around rounded-md p-4 my-2">
      <div className="flex justify-between font-bold" onClick={() => setExpanded(!expanded)}>
        <div>
          <p>{title}</p>
        </div>
        <ChevronDown className={`${expanded ? '' : '-rotate-90'} transition-transform duration-300 `} />
      </div>
      {children && expanded && <div className="my-2 border-t-[1px]">{children}</div>}
    </div>
  );
};
