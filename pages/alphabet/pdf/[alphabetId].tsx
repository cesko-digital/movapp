import { useTranslation } from 'next-i18next';
import React from 'react';
import { getCountryVariant, Language } from 'utils/locales';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getServerSideTranslations } from '../../../utils/localization';
import { AlphabetDataObject, fetchAlphabetMain, fetchAlphabetUk } from '../../../utils/getDataUtils';
import { ParsedUrlQuery } from 'querystring';

interface UrlParams extends ParsedUrlQuery {
  alphabetId: Language;
}

const AlphabetPage = ({ alphabet }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const { t } = useTranslation();
  const alphabetCode: Language = alphabet.source;

  return (
    <>
      <div>
        <div className="max-w-4xl m-auto">
          <h1 className="text-primary-blue mb-3">{t(`alphabet_page.${alphabetCode}.name`)}</h1>
          <p className="text-xl font-light">{t(`alphabet_page.${alphabetCode}.description`)}</p>
          <div className="grid grid-cols-[auto,auto,1fr] gap-4 mt-8 text-xl font-medium">
            {alphabet.data.map(({ examples, transcription, letters }, index) => (
              <>
                <div className="" key={index}>
                  {letters.join(', ')}
                </div>
                <div className="text-gray-500 max-w-[200px]" key={index}>
                  {transcription}
                </div>
                <div>
                  {examples.map((example, index) => (
                    <span className="font-light" key={index}>
                      {example.translation} [{example.transcription}],{' '}
                    </span>
                  ))}{' '}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ alphabet: AlphabetDataObject }, UrlParams> = async ({ locale, params }) => {
  let alphabet: AlphabetDataObject;
  if (params?.alphabetId === 'uk') {
    alphabet = await fetchAlphabetUk();
  } else {
    alphabet = await fetchAlphabetMain();
  }

  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      alphabet,
      ...localeTranslations,
    },
  };
};

export const getStaticPaths: GetStaticPaths<UrlParams> = () => {
  return {
    paths: [
      {
        params: { alphabetId: 'uk' },
        locale: 'uk',
      },
      {
        params: { alphabetId: 'uk' },
        locale: getCountryVariant(),
      },
      {
        params: { alphabetId: getCountryVariant() },
        locale: 'uk',
      },
      {
        params: { alphabetId: getCountryVariant() },
        locale: getCountryVariant(),
      },
    ],
    fallback: false,
  };
};

AlphabetPage.skipLayout = true;

export default AlphabetPage;
