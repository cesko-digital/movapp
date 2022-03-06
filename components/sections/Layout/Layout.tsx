import React from 'react';
import Header from './Header/index';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <main className="bg-primary-grey py-5 min-h-screen">
        <div className="max-w-4xl m-auto">{children}</div>
      </main>
    </div>
  );
};
