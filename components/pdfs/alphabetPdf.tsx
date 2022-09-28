/* eslint-disable @next/next/no-img-element */

import { GetStaticProps } from 'next';
import { FunctionComponent } from 'react';
import { AlphabetDataObject, fetchAlphabetMain, fetchAlphabetUk } from '../../utils/getDataUtils';
import csCommon from '../../public/locales/cs/common.json';

type Props = {
  title: string;
  alphabetMain: AlphabetDataObject;
  alphabetUk: AlphabetDataObject;
};

const getProperty = (obj: Record<string, any>, path: string) => {
  let current = obj;
  path.split('.').forEach((p) => {
    current = current[p];
  });
  return current;
};

const translateInPdf = (key: string) => {
  console.log(key);
  // console.log(csCommon);
  console.log(getProperty(csCommon, key));
  return getProperty(csCommon, key);
  // return csCommon[key];
};

/* eslint-disable jsx-a11y/alt-text */
const AlphabetPdf: FunctionComponent<Props> = ({ title, alphabetMain }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p className="text-base md:text-xl">{translateInPdf(`alphabet_page.uk.description`)}</p>
      {alphabetMain.data.map((letter) => (
        <p key={letter.id}>{letter.letters.toString()}</p>
      ))}
      <img src="https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg" width="300px" />;{' '}
    </div>
  );
};

export const getServerSideProps: GetStaticProps<{ alphabetMain: AlphabetDataObject; alphabetUk: AlphabetDataObject }> = async ({}) => {
  const alphabetMain = await fetchAlphabetMain();
  const alphabetUk = await fetchAlphabetUk();
  // const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      alphabetMain,
      alphabetUk,
      // ...localeTranslations,
    },
  };
};

export default AlphabetPdf;
