import { Footer } from './Footer';
import Header from './Header/index';
import { ScrollToTop } from 'components/basecomponents/ScrollToTop';
import { CountryVariant } from 'utils/locales';

export const PLAUSIBLE_DOMAINS: Record<CountryVariant, string> = {
  cs: 'movapp.cz, all.movapp.eu',
  sk: 'sk.movapp.eu, all.movapp.eu',
  pl: 'pl.movapp.eu, all.movapp.eu',
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* <Script data-domain={PLAUSIBLE_DOMAINS[getCountryVariant()]} src="https://plausible.io/js/plausible.js" /> */}
      <main className="bg-white sm:bg-primary-grey pt-2 pb-5 px-2 flex flex-col flex-grow">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
