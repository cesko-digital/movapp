import { ReactElement, useEffect, useState } from 'react';
import ChevronDown from 'public/icons/chevron-down.svg';
import ChevronRight from 'public/icons/chevron-right.svg';
import LinkIcon from 'public/icons/link.svg';
import { useRouter } from 'next/router';
import { Category } from 'utils/getDataUtils';
import { normalizeForId } from 'utils/textNormalizationUtils';

interface CollapseProps {
  title: string | ReactElement;
  children: React.ReactNode;
  index: number;
  ariaId?: string;
  id?: string;
  category?: Category;
}

const copyToClipboard = (str: string) => {
  navigator.clipboard.writeText(str);
};

export const Collapse = ({ title, children, ariaId, id, category }: CollapseProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const getSectionHyperlink = (): string | undefined => {
    if (typeof window === 'undefined') {
      return;
    }

    const hyperlinkBits = [window.location.origin];

    if (router.locale && router.locale !== router.defaultLocale) {
      hyperlinkBits.push(`/${router.locale}`);
    }

    hyperlinkBits.push(`${router.pathname}#${id}`);

    return hyperlinkBits.join('');
  };

  const handleLinkClick = async () => {
    const hyperLink = getSectionHyperlink();

    if (hyperLink) {
      await router.push(hyperLink);
      copyToClipboard(hyperLink);
    }
  };

  useEffect(() => {
    const path = router.asPath;
    const bookmark = path.substring(path.indexOf('#') + 1);

    if (id === bookmark) {
      setExpanded(true);
    } else if (category && bookmark === normalizeForId(category?.nameMain)) {
      setExpanded(true);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [id, router]);

  return (
    <div id={id} className={`bg-white block border-b-1 border-b-primary-grey  group`}>
      <div className="flex gap-2 p-2 md:p-4">
        <LinkIcon
          onClick={handleLinkClick}
          className="w-3 h-3 justify-self-center self-center cursor-pointer md:w-4 md:h-4 md:group-hover:visible md:invisible inline-block active:scale-125 active:fill-primary-yellow active:stroke-primary-yellow transition duration-100 fill-primary-blue stroke-primary-blue"
        />
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex flex-1 justify-between  items-center "
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
