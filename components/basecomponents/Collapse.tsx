import React, { ReactElement, useState } from 'react';
import ChevronDown from '../../public/icons/chevron-down.svg';

interface CollapseProps {
  title: string | ReactElement;
  children: React.ReactNode;
}

export const Collapse = ({ title, children }: CollapseProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white p-4 border-b-1 border-b-primary-grey">
      <div className="flex justify-between " onClick={() => setExpanded(!expanded)}>
        <div>
          <p className="text-primary-blue text-lg font-bold">{title}</p>
        </div>
        <ChevronDown className={`${expanded ? '' : '-rotate-90'} transition-transform duration-300 `} />
      </div>
      {children && expanded && <div className="my-2 ">{children}</div>}
    </div>
  );
};
