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

        <meta name="image" property="og:image" content="https://www.movapp.cz/movapp-cover.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.movapp.cz/movapp-cover.jpg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
