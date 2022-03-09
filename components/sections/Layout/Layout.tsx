import Script from 'next/script';
import { Footer } from './Footer';
import Header from './Header/index';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <Script data-domain="movapp.cz" src="https://plausible.io/js/plausible.js" />
      <main className="bg-primary-grey pt-0 pb-8 sm:py-8 min-h-screen px-2 sm:px-4">
        <div className="m-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
};
