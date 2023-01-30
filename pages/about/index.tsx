import { useTranslation, Trans } from 'next-i18next';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import SEO from 'components/basecomponents/SEO';
import { H2, TextLink, P } from 'components/Typography';
import Image from 'next/image';
import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { getServerSideTranslations } from 'utils/localization';
import articles from '../../data/articles/articles.json';

interface TeamStucture {
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

interface TeamSection {
  team: TeamStucture['sections'][number]['name'];
  members: string;
}

type ArticleType = {
  title: string;
  url: string;
  sourceName: string;
  lang: string;
  publishDate: string;
};

type ArticlesListProps = {
  articles: ArticleType[];
};

type ArticleProps = {
  article: ArticleType;
};

const flagEmojis: Record<string, string> = {
  uk: '🇺🇦',
  cs: '🇨🇿',
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  pl: '🇵🇱',
  ru: '🇷🇺',
  sk: '🇸🇰',
};

const Article = ({ article }: ArticleProps): JSX.Element => {
  return (
    <div className="w-full md:max-w-full md:flex p-2 md:p-4 bg-white border-b-1 border-b-primary-grey">
      <a className="hover:text-primary-blue" href={article.url}>
        {article.title}
      </a>
      <div className="font-light">
        <span className="inline-block lg:pl-2 pr-2">{article.sourceName}</span>
        <span className="inline-block pr-2">{new Date(article.publishDate).toLocaleDateString()}</span>
        <span role="img">{flagEmojis[article.lang]}</span>
      </div>
    </div>
  );
};

const ArticlesList = ({ articles }: ArticlesListProps): JSX.Element => {
  return (
    <ul>
      {articles.map((article, index) => (
        <li key={index}>
          <Article article={article} />
        </li>
      ))}
    </ul>
  );
};

const About: NextPage<{ teams: TeamSection[] }> = ({ teams }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <>
      <SEO title={t('seo.about_page_title')} description={t('seo.about_page_description')} />
      <div className="max-w-7xl m-auto pb-6">
        <h1 className="text-primary-blue">
          <Trans className="block my-2">{t('about_page.title')}</Trans>
        </h1>
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
            components={[<TextLink href="https://creativecommons.org/licenses/by-nc/4.0/deed.cs" target="_blank" key="creativecommons" />]}
          />
        </P>

        <Trans
          i18nKey={'about_page.why_movapp_origin'}
          t={t}
          components={[
            <TextLink
              href="https://drive.google.com/drive/u/0/folders/129vObZ0vUHpDd07slIfaiAfKsEbx1mNw"
              target="_blank"
              key="drive.google.com"
            />,
          ]}
        />

        <H2>{t('about_page.our_team_title')}</H2>

        <h3 className="mb-1 sm:my-4">{t('about_page.our_team_current_title')}</h3>
        <Image
          src="https://data.movapp.eu/images/team/small-team-photo-autumn.jpg"
          width="320"
          height="180"
          alt={t('about_page.our_team_current_title')}
          className="hover:cursor-pointer"
          onClick={() => window.open('https://data.movapp.eu/images/team/large-team-photo-autumn.jpg', '_blank')}
        />

        <h3 className="mb-1 sm:my-4">{t('about_page.our_team_spring_title')}</h3>
        <Image
          src="https://data.movapp.eu/images/team/small-team-photo.jpg"
          width="320"
          height="180"
          alt={t('about_page.our_team_spring_title')}
          className="hover:cursor-pointer"
          onClick={() => window.open('https://data.movapp.eu/images/team/large-team-photo.jpg', '_blank')}
        />

        {teams.map(({ team, members }) => (
          <React.Fragment key={team[currentLanguage]}>
            <H2>{team[currentLanguage]}</H2>
            <P className="inline-block">{members}</P>
          </React.Fragment>
        ))}

        <div className="my-4">
          <Trans
            i18nKey={'about_page.our_team_contact'}
            components={[<TextLink href={`/contacts`} locale={currentLanguage} target="_self" key="contacts" />]}
          />
        </div>

        <H2>{t('about_page.media_mentions_title')}</H2>
        <ArticlesList articles={articles} />

        <H2>{t('about_page.how_to_find_us_title')}</H2>
        <Trans i18nKey={'about_page.how_to_find_us_description'} />

        <H2>{t('about_page.stand_with_ukraine_title')}</H2>
        <Trans
          i18nKey={'about_page.stand_with_ukraine_description'}
          components={[<TextLink href="https://stojimezaukrajinou.cz/" target="_blank" key="stojimezaukrajinou" />]}
        />

        <H2>{t('about_page.czech_digital_title')}</H2>
        <Trans
          i18nKey={'about_page.czech_digital_description'}
          components={[<TextLink href="https://cesko.digital/" target="_blank" key="cesko.digital" />]}
        />
      </div>
    </>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const promise = await fetch('https://data.movapp.eu/team.v1.json');
  const teams: TeamStucture = await promise.json();

  if (promise.status === 404) {
    return {
      notFound: true,
    };
  }

  const pluck: TeamSection[] = teams.sections.map(({ name, members }) => ({
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
