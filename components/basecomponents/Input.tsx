import { HTMLProps } from 'react';

export const SearchInput = (props: HTMLProps<HTMLInputElement>): JSX.Element => {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      type="text"
      className={` ${className} rounded-md md:rounded-lg py-2 px-3 text-dark-700   border-1 border-primary-blue outline-none shadow-s`}
    />
  );
};
