import { useTranslation, Trans } from 'next-i18next';
export { getStaticProps } from 'utils/localization';
import SEO from 'components/basecomponents/SEO';
import { NestedLayout } from 'pages/about/layout';
import { NextPageWithLayout } from 'pages/_app';
import { H2, LinkText } from 'components/Typography';

// TODO translations
const About: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('seo.about_page_title')}
        description={t('seo.about_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
      <h1 className="text-primary-blue pb-4">
        <Trans>{t('about_page.title')}</Trans>
      </h1>
      <H2>{t('about_page.how_to_find_us_title')}</H2>
      <Trans i18nKey={'about_page.how_to_find_us_description'} />

      <H2>{t('about_page.stand_with_ukraine_title')}</H2>
      <Trans
        i18nKey={'about_page.stand_with_ukraine_description'}
        components={[<LinkText href="https://stojimezaukrajinou.cz/" target="_blank" key="https://stojimezaukrajinou.cz/" />]}
      />
      <H2>{t('about_page.czech_digital_title')}</H2>
      <Trans
        i18nKey={'about_page.czech_digital_description'}
        components={[<LinkText href="https://cesko.digital/" target="_blank" key="https://cesko.digital/" />]}
      />
    </>
  );
};

About.getLayout = function getLayout(page: React.ReactElement) {
  return <NestedLayout>{page}</NestedLayout>;
};

export default About;
