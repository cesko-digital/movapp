import Link, { LinkProps } from 'next/link';
import React from 'react';
import { Language } from 'utils/locales';

const H2 = ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-1 mt-5 sm:my-4 text-primary-blue" {...props} />;

const P = ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-6" {...props} />;

type LinkTextProps = React.PropsWithChildren<LinkProps> & {
  target?: '_blank' | '_self';
  locale?: Language;
  className?: string;
};

const TextLink = ({ href, children, target, locale, className }: LinkTextProps) => {
  return (
    <Link locale={locale} href={href} target={target} className={`underline text-primary-blue ${className}`}>
      {children}
    </Link>
  );
};

export { H2, P, TextLink };
