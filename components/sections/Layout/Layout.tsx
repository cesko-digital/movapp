import React from 'react';
import { Footer } from './Footer';
import Header from './Header/index';
// import Footer from './Footer/index';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <main className="bg-primary-grey pt-0 pb-8 sm:py-8 min-h-screen px-2 sm:px-4">
        <div className="m-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
