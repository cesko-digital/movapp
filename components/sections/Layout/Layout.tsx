import Script from 'next/script';
import { Footer } from './Footer';
import Header from './Header/index';
import { ScrollToTop } from 'components/basecomponents/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <Script data-domain="movapp.cz" src="https://plausible.io/js/plausible.js" />
      <main className="bg-white sm:bg-primary-grey pt-2 pb-5 min-h-screen px-2 m-auto">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
