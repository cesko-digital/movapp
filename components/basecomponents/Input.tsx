import { HTMLProps } from 'react';

interface SearchInputProps extends HTMLProps<HTMLInputElement> {
  hiddenLabel: boolean;
}

export const SearchInput = ({ hiddenLabel, id, label, ...rest }: SearchInputProps): JSX.Element => {
  return (
    <div className="w-full">
      {label && (
        <label className={`${hiddenLabel ? 'hidden' : 'block'} mb-1`} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...rest}
        id={id}
        type="text"
        className={`w-full rounded-md md:rounded-lg py-2 px-3 text-dark-700 border-1 border-primary-blue outline-none shadow-s`}
      />
    </div>
  );
};
