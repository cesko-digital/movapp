import { useTranslation } from 'next-i18next';
import React from 'react';
import { FunctionComponent } from 'react';
import { getCountryVariant, Language } from 'utils/locales';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import stories from '../../../../data/stories';
import { ParsedUrlQuery } from 'querystring';
import PdfHeader from '../../../../components/basecomponents/PdfComponents/PdfHeader';
import { Story } from '@types';
import { StoryPhrase, getStoryData } from '../../../../components/basecomponents/Story/storyStore';
import { useLanguage } from 'utils/useLanguageHook';

interface StoriesProps {
  story: Story | undefined;
  storyData: StoryPhrase[];
}

interface UrlParams extends ParsedUrlQuery {
  storyId: string;
}

// Constants
const WEB_LINK: Record<string, string> = {
  cs: '<a style="color: blue;margin-left: 4px;" href="https://movapp.cz/kids/stories">www.movapp.cz</a>',
  uk: '<a style="color: blue;margin-left: 4px;" href="https://movapp.cz/uk/kids/stories">www.movapp.cz</a>',
};

const MOVAPP_TAGLINE: Record<string, string> = {
  cs: `Nahrávku k téhle pohádce a mnohé další pohádky najdete na ${WEB_LINK['cs']}.`,
  uk: `Озвучення цієї та багатьох інших казок ви можете знайти на ${WEB_LINK['uk']}.`,
};

const StoryPage = ({ story, storyData }: StoriesProps): JSX.Element => {
  const { t } = useTranslation();
  const { currentLanguage, otherLanguage } = useLanguage();

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
              <td className="align-top p-2 min-w-[100px]" />
              <td className="align-top p-2 text-2xl font-bold">{story.title[currentLanguage]}</td>
              <td className="align-top p-2 text-2xl font-bold">{story.title[otherLanguage]}</td>
            </tr>
          ) : null}
          {story
            ? storyData.map((phrase: StoryPhrase, index: number) => (
                <tr key={phrase.start_cs} className="break-inside-avoid">
                  <td className="align-top p-2 max-w-[100px] text-gray-300">{index}</td>
                  <td className="align-top p-2"> {currentLanguage === 'uk' ? phrase.uk : phrase.main}</td>
                  <td className="align-top p-2" key={index}>
                    {currentLanguage === 'uk' ? phrase.main : phrase.uk}
                  </td>
                </tr>
              ))
            : null}
        </table>
        {story ? <StoryImage /> : null}
        <div
          className="text-sm font-light mt-4 flex justify-center"
          dangerouslySetInnerHTML={{ __html: MOVAPP_TAGLINE[currentLanguage] }}
        />
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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const storyId = params?.storyId ?? '';
  const story = stories.find((s) => s.slug === storyId);
  const storyLocale = getCountryVariant();

  if (!story) {
    return {
      notFound: true,
    };
  }

  let storyData: StoryPhrase[] = [];
  try {
    storyData = await getStoryData(storyLocale ?? 'cs', String(story?.slug));
  } catch (err) {
    console.error(err);
  }

  return {
    props: { story, storyData, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoryPage;
