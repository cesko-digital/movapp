import { forwardRef } from 'react';

interface SearchInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  hiddenLabel: boolean;
  setSearch: (value: string) => void;
  resetInput?: () => void;
  className?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ hiddenLabel, id, label, resetInput, value, className, placeholder, setSearch }, ref): JSX.Element => {
    return (
      <div className={`relative ${className} transition duration-500 w-full`}>
        {label && (
          <label className={`${hiddenLabel ? 'hidden' : 'block'} mb-1`} htmlFor={id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          value={value}
          id={id}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          className={`rounded-md md:rounded-lg  focus:border-yellow-400 box-border w-full h-[44px] focus:border-2 py-2 px-3 text-dark-700 border-1 border-primary-blue outline-none shadow-s`}
        />
        {value?.trim() && (
          <button
            onClick={resetInput}
            type="reset"
            className="cursor-pointer after:content-['x'] after:text-[10px] after:block after:text-white after:bg-primary-black after:rounded-full  after:content-between after:leading-4 after:h-4 after:w-4 after:top-1/2  after:-translate-y-1/2  after:bottom-0 after:absolute after:right-4 "
          />
        )}
      </div>
    );
  }
);
