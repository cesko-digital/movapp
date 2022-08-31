import SEO from 'components/basecomponents/SEO';
import { H2, LinkText, P } from 'components/Typography';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { getServerSideTranslations } from 'utils/localization';
import { useLanguage } from 'utils/useLanguageHook';
import { NestedLayout } from '../_NestedLayout';

interface Members {
  sections: [
    {
      name: string;
      members: [
        {
          name: string;
        }
      ];
    }
  ];
}

const Team: NextPageWithLayout<{ teams: Members }> = ({ teams }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const pluck = teams.sections.map(({ name, members }) => ({
    name,
    members: members.map(({ name }) => name).join(', '),
  }));

  return (
    <>
      <SEO
        title={t('seo.about_page_title')}
        description={t('seo.about_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
      <H2>{t('about_page.our_team_title')}</H2>

      {pluck.map(({ name, members }) => (
        <React.Fragment key={name}>
          <H2>{name}</H2>
          <P className="inline-block">{members}</P>
        </React.Fragment>
      ))}

      <P className='mt-10'>
        <Trans
          i18nKey={'about_page.our_team_contact'}
          components={[<LinkText href={`/contacts`} locale={currentLanguage} target="_self" key="/contacts" />]}
        />
      </P>
    </>
  );
};

export default Team;

Team.getLayout = function getLayout(page: React.ReactElement) {
  return <NestedLayout>{page}</NestedLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const promise = await fetch('https://data.movapp.eu/team.json');
  const teams: Members = await promise.json();

  if (promise.status === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      teams,
      ...(await getServerSideTranslations(locale)),
    },
  };
};
