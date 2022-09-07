import SEO from 'components/basecomponents/SEO';
import { H2, LinkText, P } from 'components/Typography';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { getServerSideTranslations } from 'utils/localization';
import { useLanguage } from 'utils/useLanguageHook';
import { NestedLayout } from '../../../components/sections/Layout/NestedLayout';

interface Members {
  sections: [
    {
      name: {
        cs: string;
        pl: string;
        uk: string;
        sk: string;
        en: string;
      };
      members: [
        {
          name: string;
        }
      ];
    }
  ];
}

interface Teams {
  team: Members['sections'][number]['name'];
  members: string;
}

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

      <div className="text-center mb-9">
        <H2>{t('about_page.our_team_title')}</H2>
        <Image
          src="https://www.movapp.cz/images/team/small-team-photo.jpg"
          width="580"
          height="280"
          alt="team"
          className='hover:cursor-pointer'
          onClick={() => window.open('https://www.movapp.cz/images/team/large-team-photo.jpg', '_blank')}
        />
      </div>

      {teams.map(({ team, members }) => (
        <React.Fragment key={team[currentLanguage]}>
          <H2>{team[currentLanguage]}</H2>
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
  const promise = await fetch('https://data.movapp.eu/team.v1.json');
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