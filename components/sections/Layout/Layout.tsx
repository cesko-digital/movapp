import Script from 'next/script';
import { Footer } from './Footer';
import Header from './Header/index';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { ScrollToTop } from '../../basecomponents/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  /**
   *   This overwrites the html lang attribute from our non-standard locale naming (ua/cz) to the correct ISO 639-1 language code (uk/cs).
   *   Happens on every rerender of Layout. The alternative is to change our locale names to uk/cs (would also affect routes,
   *   might as well change it everywhere for consistency at that point).
   */
  const { i18n } = useTranslation('common');
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language === 'cz' ? 'cs' : 'uk');
  });

  return (
    <div>
      <Header />
      <Script data-domain="movapp.cz" src="https://plausible.io/js/plausible.js" />
      <main className="bg-white sm:bg-primary-grey pb-8 min-h-screen">
        <div className="m-auto">{children}</div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
