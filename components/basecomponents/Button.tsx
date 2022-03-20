import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button = forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element => {
  const { text, className, ...rest } = props;
  return (
    <button className={`${className} bg-primary-blue text-white  h-auto rounded-lg py-2 px-5`} ref={ref} {...rest}>
      {text}
    </button>
  );
});
