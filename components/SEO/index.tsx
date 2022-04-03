import React from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  image: string;
}

const SEO = ({ title, description, image }: Props) => {
  return (
    <Head>
      <meta name="referrer" content="no-referrer" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="name" content={title} />
      <meta name="image" property="og:image" content={image} />
      <meta name="og:title" content={title} />
      <meta name="og: description" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default SEO;
