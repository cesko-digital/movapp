import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description?: string;
  image?: string;
  noreferrer?: boolean;
}

const SEO = ({ title, description, image = 'https://www.movapp.cz/icons/movapp-cover.jpg', noreferrer = true }: Props) => {
  const appliedDescription = description ?? title;
  return (
    <Head>
      {noreferrer && <meta name="referrer" content="no-referrer" />}
      <title>{title}</title>
      <meta name="description" content={appliedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={appliedDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={appliedDescription} />
    </Head>
  );
};

export default SEO;
