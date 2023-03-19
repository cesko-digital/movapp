import { useTranslation } from 'next-i18next';
import React from 'react';
import { getCountryVariant, Language } from 'utils/locales';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import stories from '../../../../data/stories';
import { ParsedUrlQuery } from 'querystring';
import PdfHeader from '../../../../components/basecomponents/PdfComponents/PdfHeader';
import { Story } from '../index';
import { StoryPhrase, STORIES } from '../../../../components/basecomponents/Story/storyStore';
import { useLanguage } from 'utils/useLanguageHook';

interface StoriesProps {
  story: Story | undefined;
}

interface UrlParams extends ParsedUrlQuery {
  storyId: string;
}

const StoryPage = ({ story }: StoriesProps): JSX.Element => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const WEB_LINK: Record<string, string> = {
    cs: '<a style="color: blue;" href="https://movapp.cz/kids/stories">www.movapp.cz</a>',
    uk: '<a style="color: blue;" href="https://movapp.cz/uk/kids/stories">www.movapp.cz</a>',
  };

  const MOVAPP_TAGLINE: Record<string, string> = {
    cs: `Zvuk k téhle pohádce a také další pohádky můžete najdete na webu ${WEB_LINK['cs']}.`,
    uk: `Озвучення цієї та інших казок можна знайти на сайті ${WEB_LINK['uk']}.`,
  };

  return (
    <div>
      <div className="max-w-4xl m-auto">
        <PdfHeader title={t(`seo.kids_page_storiesTitlePdf.${getCountryVariant()}`)} />
        <div className="text-xl font-light" dangerouslySetInnerHTML={{ __html: MOVAPP_TAGLINE[currentLanguage] }}></div>
        <table className="mt-8 text-xl font-medium">
          {story
            ? STORIES[story.slug].map((phrase: StoryPhrase, index: number) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="align-top p-2 max-w-[100px]">{index}</td>
                  <td className="align-top p-2"> {currentLanguage === 'cs' ? phrase.main : phrase.uk}</td>
                  <td className="align-top p-2" key={index}>
                    {currentLanguage === 'cs' ? phrase.uk : phrase.main}
                  </td>
                </tr>
              ))
            : null}
        </table>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<UrlParams> = async () => {
  const paths: { params: { storyId: string }; locale: Language }[] = [];

  stories.forEach((story) => {
    paths.push({
      params: { storyId: story.slug },
      locale: 'uk',
    });
    paths.push({
      params: { storyId: story.slug },
      locale: getCountryVariant(),
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<StoriesProps, UrlParams> = async ({ params, locale }) => {
  const storyId = params?.storyId ?? '';
  const story = stories.find((s) => s.slug === storyId);

  return {
    props: { story, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoryPage;
