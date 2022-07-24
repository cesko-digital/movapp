import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useMemo, useState } from 'react';
import { visit } from 'unist-util-visit';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import Head from 'next/head';
import { getCountryVariant } from 'utils/locales';
import { getServerSideTranslations } from '../../utils/localization';

export const sanitizeWikiParam = (param: string): string => {
  return param.replace(/[^A-za-z0-9-]/g, '').slice(0, 150);
};

const Wiki = ({ markdown }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [seoTitle, setSEOTitle] = useState('');

  const markdownString = useMemo(
    () =>
      unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(() => (tree) => {
          visit(tree, 'link', (node) => {
            if (!/https/.test(node.url)) {
              node.url = `/wiki/${node.url}`;
            }
          });
          // replaces title if heading H1 exists
          visit(tree, 'heading', (node) => {
            if (node.depth === 1) {
              setSEOTitle((node.children[0] as { value: string }).value);
            }
          });
        })
        .use(remarkRehype)
        .use(rehypeExternalLinks)
        .use(rehypeStringify)
        .processSync(markdown)
        .toString(),
    [markdown]
  );

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        {/* @TODO - add description */}
      </Head>
      <div className="max-w-7xl m-auto" id="markdown" dangerouslySetInnerHTML={{ __html: markdownString }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const getWikiPage = async (article: string) => {
    const response = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${sanitizeWikiParam(article)}.md`);
    const markdown = await response.text();
    return markdown;
  };

  const mainLanguage = getCountryVariant();

  let markdown;
  if (locale === mainLanguage) {
    markdown = await getWikiPage(mainLanguage);
  } else {
    markdown = await getWikiPage(`uk-${mainLanguage}`);
  }

  return {
    props: {
      markdown,
      ...(await getServerSideTranslations(locale)),
    },
    revalidate: 10,
  };
};

export default Wiki;
