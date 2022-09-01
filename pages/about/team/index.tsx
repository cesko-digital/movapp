import SEO from 'components/basecomponents/SEO';
import { H2, LinkText, P } from 'components/Typography';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { getServerSideTranslations } from 'utils/localization';
import { useLanguage } from 'utils/useLanguageHook';
import { NestedLayout } from '../layout';

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

interface Teams {
  team: string;
  members: string;
}

// TODO translations
const Team: NextPageWithLayout<{ teams: Teams[] }> = ({ teams }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <>
      <SEO
        title={t('seo.about_team_title')}
        description={t('seo.about_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
        
      <H2>{t('about_page.our_team_title')}</H2>

      {teams.map(({ team, members }) => (
        <React.Fragment key={team}>
          <H2>{team}</H2>
          <P className="inline-block">{members}</P>
        </React.Fragment>
      ))}

      <P className="mt-10">
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

  const pluck: Teams[] = teams.sections.map(({ name, members }) => ({
    team: name,
    members: members.map(({ name }) => name).join(', '),
  }));

  return {
    props: {
      teams: pluck,
      ...(await getServerSideTranslations(locale)),
    },
  };
};
