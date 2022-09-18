import { Footer } from './Footer';
import Header from './Header/index';
import { ScrollToTop } from 'components/basecomponents/ScrollToTop';
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="bg-white sm:bg-primary-grey pt-2 pb-5 px-2 flex flex-col flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
