import { ReactElement, useState } from 'react';
import ChevronDown from 'public/icons/chevron-down.svg';
import ChevronRight from 'public/icons/chevron-right.svg';

interface CollapseProps {
  title: string | ReactElement;
  children: React.ReactNode;
  ariaId?: string;
}

export const Collapse = ({ title, children, ariaId }: CollapseProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border-b-1 border-b-primary-grey ">
      <button
        className="w-full grid cursor-pointer p-4 grid-cols-[90%_10%] items-center "
        aria-expanded={expanded}
        aria-controls={ariaId}
        id={`${ariaId}_button`}
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-primary-blue text-base font-medium sm:text-lg sm:font-bold text-left">{title}</p>
        <div className="justify-self-end cursor-pointer">
          {expanded ? <ChevronDown className="fill-primary-blue" /> : <ChevronRight className="fill-primary-blue" />}
        </div>
      </button>
      {children && expanded && (
        <div id={ariaId} role="region" className="my-2" aria-labelledby={`${ariaId}_button`}>
          {children}
        </div>
      )}
    </div>
  );
};
