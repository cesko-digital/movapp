import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import ChevronRight from '../../public/icons/chevron-right.svg';

interface LanguageSelectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  languages: [string, string];
}

export const LanguageSelect = forwardRef((props: LanguageSelectProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { active, languages, ...rest } = props;
  return (
    <button
      aria-selected={active}
      {...rest}
      ref={ref}
      className={`bg-primary-yellow cursor-pointer  mr-4 p-1 inline-flex  justify-between ${active && 'shadow-[inset_0px_-4px_red]'} `}
    >
      <span className="uppercase">{languages[0]}</span>
      <ChevronRight className="fill-primary-blue inline" />
      <span className="uppercase">{languages[1]}</span>
    </button>
  );
});
