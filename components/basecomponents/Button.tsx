import { forwardRef } from 'react';

const BASE_STYLE = 'h-auto rounded';
const PRIMARY_STYLE = `${BASE_STYLE} bg-primary-blue text-white`;
const TEXT_PADDING = 'px-10 py-2';
const ICON_PADDING = 'px-2 py-2';

const BUTTON_STYLE = {
  default: `text-white h-auto rounded-lg py-2 px-5`,
  primary: `${PRIMARY_STYLE} ${TEXT_PADDING}`,
  primaryIcon: `${PRIMARY_STYLE} ${ICON_PADDING}`,
};

interface ButtonProps extends React.ComponentProps<'button'> {
  buttonStyle?: keyof typeof BUTTON_STYLE;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, buttonStyle = 'default', ...rest }, ref) => {
  return (
    <button {...rest} ref={ref} className={`${className} ${BUTTON_STYLE[buttonStyle]}`}>
      {children}
    </button>
  );
});
