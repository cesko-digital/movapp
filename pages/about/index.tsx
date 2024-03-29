import { useTranslation, Trans } from 'next-i18next';
import { getCountryVariant } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import SEO from 'components/basecomponents/SEO';
import { H2, TextLink, P } from 'components/Typography';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { getServerSideTranslations } from 'utils/localization';
import articles from '../../data/articles/articles.json';
import help from '../../public/icons/about/help-us.png';
import { SliderImageTeam } from 'components/basecomponents/SliderImageTeam';
import { SliderFeedbacks } from 'components/basecomponents/FeedbackAboutProject/SliderFeedbacks';
import { SliderFeedbacksSm } from 'components/basecomponents/FeedbackAboutProject/SLiderFeedbacksSm';

type Link = string;

type Links = {
  cs: Link;
  sk: Link;
  pl: Link;
  uk: Link;
};

type key = string;

const NAVIGATION: Record<key, Links> = {
  stojimezaukrajinou: {
    cs: 'https://www.stojimezaukrajinou.cz/',
    sk: 'https://www.stojimezaukrajinou.cz/',
    pl: 'https://www.stojimezaukrajinou.cz/en',
    uk: 'https://www.stojimezaukrajinou.cz/uk',
  },
  'cesko.digital': {
    cs: 'https://cesko.digital/',
    sk: 'https://cesko.digital/',
    pl: 'https://en.cesko.digital/',
    uk: 'https://en.cesko.digital/',
  },
};

const partners = [
  {
    title: 'Centrum pro integraci cizinců',
    url: 'https://www.cicops.cz/',
    logo: '/icons/about/cic_logo_bez_pozadí.png',
  },
  {
    title: 'Městská knihovna v Praze',
    url: 'https://www.mlp.cz/',
    logo: '/icons/about/mestska_knihovna_Praha_v2.svg',
  },
  {
    title: 'Post Bellum',
    url: 'https://www.postbellum.cz/',
    logo: '/icons/about/PB-logo-black-vertical-01.png',
  },
  {
    title: 'Katedra informačních studií a knihovnictví (KISK), Masarykova univerzita',
    url: 'https://kisk.phil.muni.cz/',
    logo: '/icons/about/logo-kisk.png',
  },
  {
    title: 'Prague Maidan - Ukrajinské Centrum Nusle',
    url: 'https://www.maidan.cz/',
    logo: '/icons/about/logo-maidan.png',
  },
];

type Partner = {
  title: string;
  url: string;
  logo: string;
};

type PartnerListProps = {
  partners: Partner[];
};

const PartnerList = ({ partners }: PartnerListProps) => {
  return (
    <ul className="flex flex-wrap xl:space-x-5 justify-center">
      {partners.map((partner) => (
        <li key={partner.title} className={'w-36 my-5 xl:my-0 md:w-40 h-20 relative'}>
          <a href={partner.url} target="_blank" rel="noopener">
            <div className="relative w-full h-full">
              <Image src={partner.logo} fill alt={partner.title} title={partner.title} className="object-contain" />
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

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
  const [formatedDate, setFormatedDate] = React.useState<string>('');

  useEffect(() => {
    setFormatedDate(new Date(article.publishDate).toLocaleDateString());
  }, [article.publishDate]);

  return (
    <div className="w-full md:max-w-full md:flex p-2 md:p-4 border-b-1">
      <a className="hover:text-primary-blue mr-2" href={article.url}>
        {article.title}
      </a>
      <div className="font-light">
        <span className="inline-block lg:pl-2 pr-2">{article.sourceName}</span>
        <span className="inline-block pr-2">{formatedDate}</span>
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
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <SEO title={t('seo.about_page_title')} description={t('seo.about_page_description')} />
      <div className="max-w-7xl m-auto pb-6 font-normal">
        <div className="max-w-[780px] text-center mx-auto md:py-[124px] py-20 px-4 ">
          <h1 className="text-primary-blue whitespace-pre-line ">
            <Trans className="block my-2">{t('about_page.title')}</Trans>
          </h1>
        </div>

        <section className=" px-4 md:text-sm">
          <div className="md:grid grid-flow-col gap-[90px]">
            <div>
              <div className=" mt-0 mb-9 display-flex">
                <H2>{t('about_page.movapp_goal_title')}</H2>
                {t(`about_page.movapp_goal_description.${getCountryVariant()}`)}
              </div>
              <div className="md:mb-8">
                {currentLanguage.toString() === 'cs' || currentLanguage.toString() === 'uk' ? (
                  <>
                    <H2>{t('about_page.movapp_origin_title')}</H2>
                    <Trans
                      components={[
                        <TextLink href={currentLanguage.toString() === 'cs' ? '/wiki/pribeh' : '/wiki/istorija'} key="movapp_story" />,
                        <TextLink
                          href={currentLanguage.toString() === 'cs' ? '/wiki/vyvoj-titulni-stranky' : '/wiki/zminy-na-holovnii-storintsi'}
                          key="movapp_page_changes"
                        />,
                      ]}
                    >
                      {t('about_page.movapp_origin_description')}
                    </Trans>
                  </>
                ) : null}
              </div>
            </div>

            <div className="pt-[3px]">
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
                    <TextLink
                      href={`https://creativecommons.org/licenses/by-nc/4.0/deed.${currentLanguage === 'sk' ? 'cs' : currentLanguage}`}
                      target="_blank"
                      key="creativecommons"
                    />,
                  ]}
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
            </div>
          </div>
        </section>

        <section className="md:mt-[124px] mt-20 px-4">
          <div className="text-center mb-8">
            <H2>{t('about_page.our_team_title')}</H2>
          </div>

          <SliderImageTeam />
        </section>
        <section className="md:grid md:grid-cols-3 md:gap-14 mb-16 md:mt-20 px-4 md:text-sm font-normal">
          {teams.map(({ team, members }) => (
            <React.Fragment key={team[currentLanguage]}>
              <div>
                <H2>{team[currentLanguage]}</H2>
                <P className="inline-block">{members}</P>
              </div>
            </React.Fragment>
          ))}
        </section>

        <section className="flex justify-center px-4">
          <div className="my-4 place-content-around flex-wrap md:flex-nowrap xl:max-w-[900px] md:max-w-[600px] h-52 flex md:p-16  bg-white border-b-primary-grey rounded-3xl shadow-md align-middle items-center">
            <Image src={help} alt="help" />

            <div className="md:ml-16 xl:text-[30px] md:text-[24px] sm:text-[16px] p-4">
              <Trans
                i18nKey={'about_page.our_team_contact'}
                components={[<TextLink href={`/contacts`} locale={currentLanguage} target="_self" key="contacts" />]}
              />
            </div>
          </div>
        </section>

        <section className="max-w-[1185px] md:mt-[124px] mt-20 mx-auto p-4">
          <div className="text-center mb-14 ">
            <H2>{t('about_page.said_about_us')}</H2>
          </div>
          {windowWidth <= 768 && <SliderFeedbacksSm />}
          {windowWidth > 768 && <SliderFeedbacks />}
        </section>

        <section className="mt-16 p-4">
          <div className="text-center mb-14">
            <H2>{t('about_page.media_mentions_title')}</H2>
          </div>
          <div className=" md:p-8 bg-white rounded-2xl  border-b-primary-grey shadow-md">
            <ArticlesList articles={articles} />
          </div>
        </section>

        <section className="md:mt-16 mt-20 px-4 md:text-sm ">
          <div className="md:grid md:grid-cols-2 md:gap-[90px] md:mb-10">
            <div>
              <div className="md:mb-[30px]">
                <H2>{t('about_page.conferences_title')}</H2>
                <Trans
                  i18nKey={'about_page.conferences_description'}
                  t={t}
                  components={[
                    <TextLink href="https://www.youtube.com/watch?v=ThY0ZiWmBV8&t=2353s" target="_blank" key="first_conference" />,
                    <TextLink href="https://www.youtube.com/watch?v=3UC16MhE19k&t=1660s" target="_blank" key="second_conference" />,
                  ]}
                />
              </div>
              <div>
                <H2>{t('about_page.how_to_find_us_title')}</H2>
                <Trans i18nKey={'about_page.how_to_find_us_description'} />
              </div>
            </div>
            <div>
              <div className="mb-12">
                <H2>{t('about_page.support_us_title')}</H2>
                <Trans
                  i18nKey={'about_page.support_us_description'}
                  components={[
                    <TextLink
                      href={'https://drive.google.com/drive/folders/1milRfoG2fPsod7moVKeCPM9ikm00kXup'}
                      target="_blank"
                      key="plakatky"
                    />,
                    <TextLink href={'/contacts'} key="kontakt" />,
                    <TextLink href={'https://cesko.digital/projects/movapp'} target="_blank" key="ceskodigital" />,
                    <TextLink href={'/contacts'} key="ceskodigital" />,
                    <TextLink href={'https://cesko.digital/join/form'} target="_blank" key="ceskodigital" />,
                  ]}
                />
              </div>
            </div>
          </div>

          <div>
            <H2>{t('about_page.how_we_prepared_content_title')}</H2>
            <Trans
              i18nKey={'about_page.how_we_prepared_content_description'}
              components={[
                <TextLink href={'https://chat.openai.com/'} target="_blank" key="chatgpt" />,
                <TextLink href={'https://azure.microsoft.com/en-us/products/cognitive-services/'} target="_blank" key="azuremicrosoft" />,
              ]}
            />
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-[90px] md:mb-16 mt-10">
            <div>
              <H2>{t('about_page.czech_digital_title')}</H2>
              <Trans
                i18nKey={'about_page.czech_digital_description'}
                components={[<TextLink href={NAVIGATION['cesko.digital'][currentLanguage]} target="_blank" key="cesko.digital" />]}
              />
            </div>

            <div>
              <H2>{t('about_page.stand_with_ukraine_title')}</H2>
              <Trans
                i18nKey={'about_page.stand_with_ukraine_description'}
                components={[
                  <TextLink href={NAVIGATION['stojimezaukrajinou'][currentLanguage]} target="_blank" key="stojimezaukrajinou" />,
                ]}
              />
            </div>
          </div>
        </section>

        <section className="mb-[124px] mt-[124px] ">
          <div className="text-center">
            <H2>{t('about_page.our_partners_title')}</H2>
          </div>
          <div className="flex justify-center ">
            <PartnerList partners={partners} />
          </div>
        </section>
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
