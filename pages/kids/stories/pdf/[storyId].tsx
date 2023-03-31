import { useTranslation } from 'next-i18next';
import React from 'react';
import { FunctionComponent } from 'react';
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
    cs: '<a style="color: blue;margin-left: 4px;" href="https://movapp.cz/kids/stories">www.movapp.cz</a>',
    uk: '<a style="color: blue;margin-left: 4px;" href="https://movapp.cz/uk/kids/stories">www.movapp.cz</a>',
  };

  const MOVAPP_TAGLINE: Record<string, string> = {
    cs: `Zvuk k téhle pohádce a také další pohádky můžete najdete na ${WEB_LINK['cs']}.`,
    uk: `Озвучення цієї та інших казок можна знайти на ${WEB_LINK['uk']}.`,
  };

  const StoryImage: FunctionComponent = () => {
    // NextImage does not work properly in PDFs, we use a regular <img> element instead
    return story ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={`https://www.movapp.cz/_next/image?url=%2Fkids%2F${story.slug}.jpg&w=640&q=75`}
        width="500"
        className="my-10 mx-auto"
        height="500"
        alt={story.title[currentLanguage]}
      />
    ) : null;
  };

  return (
    <div>
      <div className="max-w-4xl m-auto">
        <PdfHeader title={t(`seo.kids_page_storiesTitlePdf.${getCountryVariant()}`)} />
        <table className="mt-8 text-xl font-medium">
          {story ? (
            <tr className="break-inside-avoid">
              <td className="align-top p-2 min-w-[100px]"></td>
              <td className="align-top p-2 text-2xl font-bold">{currentLanguage === 'cs' ? story.title['cs'] : story.title['uk']}</td>
              <td className="align-top p-2 text-2xl font-bold">{currentLanguage === 'cs' ? story.title['uk'] : story.title['cs']}</td>
            </tr>
          ) : null}
          {story
            ? STORIES[story.slug].map((phrase: StoryPhrase, index: number) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="align-top p-2 max-w-[100px] text-gray-300">{index}</td>
                  <td className="align-top p-2"> {currentLanguage === 'cs' ? phrase.main : phrase.uk}</td>
                  <td className="align-top p-2" key={index}>
                    {currentLanguage === 'cs' ? phrase.uk : phrase.main}
                  </td>
                </tr>
              ))
            : null}
        </table>
        {story ? <StoryImage /> : null}
        <div
          className="text-sm font-light mt-4 flex justify-center"
          dangerouslySetInnerHTML={{ __html: MOVAPP_TAGLINE[currentLanguage] }}
        ></div>
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
