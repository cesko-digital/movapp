import Link from 'next/link';
import React from 'react';
import { Language } from 'utils/locales';

interface LinkTextProps {
  href: string;
  children?: string;
  target?: '_blank' | '_self';
  locale?: Language;
}

const H2 = ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-1 mt-5 sm:my-4 text-primary-blue" {...props} />;

const P = ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-6" {...props} />;

const LinkText = ({ href, children, target, locale }: LinkTextProps) => {
  return (
    <Link locale={locale} href={href}>
      <a target={target} className="underline text-primary-blue">
        {children}
      </a>
    </Link>
  );
};

export { H2, P, LinkText };
