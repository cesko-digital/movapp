import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import SEO from 'components/basecomponents/SEO';
import stories from '../../../data/stories';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useLanguage } from 'utils/useLanguageHook';
import { GetStaticProps } from 'next';

interface StoriesSectionProps {
  stories: Story[];
}

export interface Language {
  cs: string;
  uk: string;
  [index: string]: string;
}

export interface Story {
  title: Language;
  slug: string;
  duration: string;
}

const StoriesSection = ({ stories }: StoriesSectionProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t('seo.kids_page_title')}
        description={t('seo.kids_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />

      <div className="min-h-screen m-auto py-10 px-2 sm:px-4">
        {stories.map((story) => (
          <div className="h-42 m-auto my-8 flex bg-slate-50 rounded-2xl md:w-3/5 xl:w-2/5" key={story.slug}>
            <Image src={`/kids/tulipany.svg`} width="150" height="150" alt={story.title[currentLanguage]} />
            <div className="flex items-center xl:ml-12">
              <div>
                <p className="my-4 mx-12 md:text-xl ">{story.title[currentLanguage]}</p>
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 ml-12 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="md:text-lg">{story.duration}</span>
                </div>
              </div>

              <Link href={`/kids/stories/${story.slug}`}>
                <a className="w-1/2 bg-primary-blue rounded-2xl text-white text-sm md:text-base p-2 w-3/5 text-center mr-4">
                  {t('kids_page.playStory')}
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: { stories, ...(await serverSideTranslations(locale ?? 'cs', ['common'])) },
  };
};

export default StoriesSection;
