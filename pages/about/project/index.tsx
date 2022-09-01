import SEO from 'components/basecomponents/SEO';
import { H2, LinkText, P } from 'components/Typography';
import { Trans, useTranslation } from 'next-i18next';
import { NestedLayout } from 'pages/about/layout';
import { NextPageWithLayout } from 'pages/_app';
import { getCountryVariant } from 'utils/locales';
export { getStaticProps } from 'utils/localization';

// TODO translations
const Project: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('seo.about_project_title')}
        description={t('seo.about_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
      <H2>{t('about_page.movapp_goal_title')}</H2>
      {t(`about_page.movapp_goal_description.${getCountryVariant()}`)}
      <H2>{t('about_page.why_movapp_title')}</H2>
      <P>
        <Trans i18nKey={'about_page.why_movapp_mova'} />
      </P>
      <P>{t('about_page.why_movapp_description')}</P>
      <P>
        <Trans
          i18nKey={'about_page.why_movapp_license'}
          t={t}
          components={[
            <LinkText
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.cs"
              target="_blank"
              key="https://creativecommons.org/licenses/by-nc/4.0/deed.cs"
            />,
          ]}
        />
      </P>

      <Trans
        i18nKey={'about_page.why_movapp_origin'}
        t={t}
        components={[
          <LinkText
            href="https://drive.google.com/drive/u/0/folders/129vObZ0vUHpDd07slIfaiAfKsEbx1mNw"
            target="_blank"
            key="https://drive.google.com/drive/u/0/folders/129vObZ0vUHpDd07slIfaiAfKsEbx1mNw"
          />,
        ]}
      />
    </>
  );
};

export default Project;

Project.getLayout = function getLayout(page: React.ReactElement) {
  return <NestedLayout>{page}</NestedLayout>;
};
