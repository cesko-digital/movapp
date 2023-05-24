/* eslint-disable @next/next/no-img-element */
import React, { useMemo, FunctionComponent } from 'react';
import { getCountryVariant } from 'utils/locales';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getServerSideTranslations } from '../../../utils/localization';
import { useLanguage } from '../../../utils/useLanguageHook';
import { DictionaryDataObject, fetchDictionary, getKidsCategory, Phrase } from '../../../utils/getDataUtils';
import { ParsedUrlQuery } from 'querystring';

interface UrlParams extends ParsedUrlQuery {
  kidsDictionaryId: string;
}

interface PhraseImageProps {
  phrase: Phrase;
}

const KidsDictionaryPage = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);
  const { currentLanguage, otherLanguage } = useLanguage();

  const PhraseImage: FunctionComponent<PhraseImageProps> = ({ phrase }) => {
    // NextImage does not work properly in PDFs, we use a regular <img> element instead
    return kidsCategory?.translations ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <div className="h-[620px] overflow-hidden">
        <img src={phrase.getImageUrl() ?? ''} width="600" className="mx-auto" height="600" alt={phrase.getTranslation(currentLanguage)} />
      </div>
    ) : null;
  };

  return (
    <div>
      <div className="flex flex-row">
        <table className="text-xl font-medium basis-1/2">
          <tbody>
            {kidsCategory?.translations
              .filter((_, index) => index % 2 === 0)
              .map((phrase) => (
                <tr key={phrase.getId()}>
                  <td>
                    <div className="border-black border-1 h-[840px] mb-2">
                      <PhraseImage phrase={phrase} />
                      <div className="p-2 h-[218px] border-t-black border-transparent border-1 flex flex-col items-center justify-center">
                        <p className="text-6xl mb-4">{phrase.getTranslation(currentLanguage)}</p>
                        <p className="text-6xl">{phrase.getTranslation(otherLanguage)}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="text-xl font-medium basis-1/2">
          <tbody>
            {kidsCategory?.translations
              .filter((_, index) => index % 2 !== 0)
              .map((phrase) => (
                <tr key={phrase.getId()}>
                  <td>
                    <div className="border-black border-1 h-[840px] mb-2">
                      <PhraseImage phrase={phrase} />
                      <div className="p-2 h-[218px] border-t-black border-transparent border-1 flex flex-col items-center justify-center">
                        <p className="text-6xl mb-4">{phrase.getTranslation(currentLanguage)}</p>
                        <p className="text-6xl">{phrase.getTranslation(otherLanguage)}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }, UrlParams> = async ({ locale, params }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      kidsDictionaryId: params?.kidsDictionaryId,
      ...localeTranslations,
    },
  };
};

export const getStaticPaths: GetStaticPaths<UrlParams> = () => {
  return {
    paths: [
      {
        params: { kidsDictionaryId: 'uk' },
        locale: 'uk',
      },
      {
        params: { kidsDictionaryId: 'uk' },
        locale: getCountryVariant(),
      },
      {
        params: { kidsDictionaryId: getCountryVariant() },
        locale: 'uk',
      },
      {
        params: { kidsDictionaryId: getCountryVariant() },
        locale: getCountryVariant(),
      },
    ],
    fallback: false,
  };
};

export default KidsDictionaryPage;
