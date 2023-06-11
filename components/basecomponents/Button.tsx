import { forwardRef } from 'react';
import PlayIcon from 'public/icons/playicon.svg';
import PlaySlowIcon from 'public/icons/slowplay.svg';

const BASE_STYLE = 'rounded-lg';
const TEXT_PADDING = 'px-5 py-2';
const ICON_PADDING = 'px-2 py-2';

const BUTTON_STYLE = {
  default: `${BASE_STYLE} text-black bg-primary-grey`,
  primary: `${BASE_STYLE} text-white bg-primary-blue disabled:grayscale disabled:opacity-75`,
  primaryLight: `${BASE_STYLE} text-black bg-primary-yellow`,
  choice: `${BASE_STYLE} text-black border border-slate-300 hover:border-slate-400 bg-white`,
  choiceCorrect: `${BASE_STYLE} text-black border border-slate-300 hover:border-slate-400 bg-primary-green`,
};

export interface ButtonProps extends React.ComponentProps<'button'> {
  buttonStyle?: keyof typeof BUTTON_STYLE;
  icon?: boolean | 'play' | 'playSlow';
  shadow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, buttonStyle = 'default', icon = false, shadow = false, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`tap-transparent ${className} ${BUTTON_STYLE[buttonStyle]} ${icon !== false ? ICON_PADDING : TEXT_PADDING} ${
          shadow ? 'button-shadow' : ''
        }`}
        {...rest}
      >
        {icon === 'play' && <PlayIcon className="inline h-auto" />}
        {icon === 'playSlow' && <PlaySlowIcon className="inline h-auto" />}
        {children}
      </button>
    );
  }
);
