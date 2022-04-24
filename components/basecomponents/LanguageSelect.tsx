import React, { forwardRef } from 'react';

interface LanguageSelectProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

export const LanguageSelect = forwardRef((props: LanguageSelectProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { active, label, onClick } = props;
  return (
    <button
      aria-selected={active}
      role="option"
      ref={ref}
      onClick={onClick}
      className={`bg-primary-yellow cursor-pointer  mr-4 p-1 inline-flex  justify-between ${active && 'shadow-[inset_0px_-4px_red]'} `}
    >
      <span className="">{label}</span>
    </button>
  );
});
