import { Html, Main, NextScript, Head } from 'next/document';

/**
 * Document default
 * @returns {JSX.Element}
 */
const Document = (): JSX.Element => {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
