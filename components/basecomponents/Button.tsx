import { forwardRef } from 'react';

const BASE_STYLE = 'h-auto rounded-lg';
const TEXT_PADDING = 'px-5 py-2';
const ICON_PADDING = 'px-2 py-2';

const BUTTON_STYLE = {
  default: `${BASE_STYLE} text-black bg-primary-grey`,
  primary: `${BASE_STYLE} text-white bg-primary-blue`,
  primaryLight: `${BASE_STYLE} text-black bg-primary-yellow`,
  choice: `${BASE_STYLE} text-black border border-slate-300 bg-white`,
};

interface ButtonProps extends React.ComponentProps<'button'> {
  buttonStyle?: keyof typeof BUTTON_STYLE;
  icon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, buttonStyle = 'default', icon = false, ...rest }, ref) => {
    return (
      <button {...rest} ref={ref} className={`${className} ${BUTTON_STYLE[buttonStyle]} ${icon ? ICON_PADDING : TEXT_PADDING}`}>
        {children}
      </button>
    );
  }
);
