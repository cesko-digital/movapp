import { ReactElement, useEffect, useState } from 'react';
import ChevronDown from 'public/icons/chevron-down.svg';
import ChevronRight from 'public/icons/chevron-right.svg';
import LinkIcon from 'public/icons/link.svg';
import { useRouter } from 'next/router';

interface CollapseProps {
  title: string | ReactElement;
  children: React.ReactNode;
  index: number;
  ariaId?: string;
  id?: string;
}

const copyToClipboard = (str: string) => {
  navigator.clipboard.writeText(str);
};

export const Collapse = ({ title, children, ariaId, id }: CollapseProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const hyperLink = typeof window !== 'undefined' && `${window.location.origin}/${router.locale}${router.pathname}#${id}`;

  useEffect(() => {
    if (id && router.asPath.includes(id)) {
      setExpanded(true);
    }
  }, [id, router]);

  return (
    <div id={id} className={`bg-white block border-b-1 border-b-primary-grey  group`}>
      <div className="grid grid-cols-[2%_98%] p-2 md:p-4">
        <LinkIcon
          onClick={() => hyperLink && copyToClipboard(hyperLink)}
          className="w-3 h-3 justify-self-center self-center cursor-pointer md:w-4 md:h-4 md:group-hover:visible md:invisible inline-block active:scale-125 active:fill-primary-yellow active:stroke-primary-yellow transition duration-100 fill-primary-blue stroke-primary-blue"
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full  flex justify-between  items-center "
          aria-expanded={expanded}
          id={`${ariaId}_button`}
        >
          <span className="text-primary-blue text-base font-medium sm:text-lg sm:font-bold text-left block">{title}</span>
          <div className="justify-self-end">
            {expanded ? <ChevronDown className="fill-primary-blue" /> : <ChevronRight className="fill-primary-blue" />}
          </div>
        </button>
      </div>
      {children && expanded && (
        <div id={ariaId} role="region" className="my-2" aria-labelledby={`${ariaId}_button`}>
          {children}
        </div>
      )}
    </div>
  );
};
