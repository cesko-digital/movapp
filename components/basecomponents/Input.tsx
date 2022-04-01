import { forwardRef, HTMLProps } from 'react';

interface SearchInputProps extends HTMLProps<HTMLInputElement> {
  hiddenLabel: boolean;
  resetInput?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ hiddenLabel, id, label, resetInput, value, type, ...rest }, ref): JSX.Element => {
    return (
      <div className="relative  w-full">
        {label && (
          <label className={`${hiddenLabel ? 'hidden' : 'block'} mb-1`} htmlFor={id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...rest}
          value={value}
          type={type}
          id={id}
          className={`w-full rounded-md md:rounded-lg py-2 px-3 text-dark-700 border-1 border-primary-blue outline-none shadow-s`}
        />
        {type === 'text' && value?.toString().trim() && (
          <button
            onClick={resetInput}
            type="reset"
            className="cursor-pointer after:content-['x'] after:text-xs after:block after:text-white after:bg-primary-black after:rounded-full  after:content-between after:leading-5 after:h-5 after:w-5 after:top-1/2  after:-translate-y-1/2  after:bottom-0 after:absolute after:right-2 "
          />
        )}
      </div>
    );
  },
);
