import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | Element;
  px?: string;
}

export const Button = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { text, className, ...rest } = props;
  const px = props.px ?? 'px-10';
  return (
    <button className={`${className} bg-primary-blue text-white  h-auto rounded py-2 ${px}`} ref={ref} {...rest}>
      {text}
    </button>
  );
});
