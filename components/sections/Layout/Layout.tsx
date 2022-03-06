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
      <main className="bg-primary-grey py-8 min-h-screen">
        <div className="max-w-4xl m-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
