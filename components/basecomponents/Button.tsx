import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | React.ReactNode;
  px?: string;
}

export const Button = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { children, className, ...rest } = props;
  const px = props.px ?? 'px-10';
  return (
    <button className={`${className} ${px} text-white h-auto rounded-lg py-2 px-5`} ref={ref} {...rest}>
      {children}
    </button>
  );
});
