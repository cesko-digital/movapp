import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getServerSideTranslations } from '../../../utils/localization';
import { DictionaryDataObject, fetchDictionary, parseCategory } from '../../../utils/getDataUtils';
import { ParsedUrlQuery } from 'querystring';
import { getCountryVariant, Language } from '../../../utils/locales';
import { useLanguage } from '../../../utils/useLanguageHook';
import { getCategoryName } from '../../../components/sections/Dictionary/dictionaryUtils';
import TitleMovappLogo from '../../../components/basecomponents/PdfComponents/TitleMovappLogo';

interface UrlParams extends ParsedUrlQuery {
  categoryId: string;
}

const DictionaryCategoryPDF = ({ dictionary, categoryId }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const categoryObject = dictionary.categories.find((category) => category.id === categoryId);
  const category = categoryObject ? parseCategory(categoryObject, dictionary) : null;
  const { currentLanguage, otherLanguage } = useLanguage();

  if (!category) {
    return <div>Category not found.</div>;
  }

  const categoryName = getCategoryName(category, currentLanguage);

  return (
    <>
      <div>
        <div className="max-w-4xl m-auto">
          <h1 className="text-primary-blue mt-0 mb-3">
            <TitleMovappLogo />
            {categoryName}
          </h1>
          <table className="mt-8 text-xl font-medium">
            <tbody>
              {category.translations.map((phrase, index) => (
                <tr key={index} className="break-inside-avoid">
                  <td className="align-top py-2 px-3">{phrase.getTranslation(currentLanguage)}</td>
                  <td className="align-top py-2 px-3">{phrase.getTranslation(otherLanguage)}</td>
                  <td className="align-top py-2 px-3 text-gray-600">[{phrase.getTranscription(otherLanguage)}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  {
    dictionary: DictionaryDataObject;
    categoryId: string;
  },
  UrlParams
> = async ({ locale, params }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      categoryId: params?.categoryId ?? '',
      ...localeTranslations,
    },
  };
};

export const getStaticPaths: GetStaticPaths<UrlParams> = async () => {
  const dictionary = await fetchDictionary();

  const paths: { params: { categoryId: string }; locale: Language }[] = [];
  dictionary.categories.forEach((category) => {
    paths.push({
      params: { categoryId: category.id },
      locale: 'uk',
    });
    paths.push({
      params: { categoryId: category.id },
      locale: getCountryVariant(),
    });
  });

  // example category id: 'recdabyHkJhGf7U5D'
  return {
    paths,
    fallback: false,
  };
};

export default DictionaryCategoryPDF;
