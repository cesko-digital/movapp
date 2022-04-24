import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useMemo, useState } from 'react';
import { normalizeWikiPagesUrl } from 'utils/textNormalizationUtils';
import { visit } from 'unist-util-visit';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const mainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT || 'cs';

const Wiki = ({ markdown }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [markdownString, setMarkdownString] = useState('');
  const [seoTitle, setSEOTitle] = useState('');

  useMemo(() => {
    const markdownText = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(() => (tree) => {
        // normalizes all internal urls to create correct links
        visit(tree, 'link', (node) => {
          if (!/https/.test(node.url)) {
            node.url = `/wiki/${normalizeWikiPagesUrl(node.url)}`;
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
      .toString();

    setMarkdownString(markdownText);
  }, [markdown]);

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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { wiki: 'wiki' }, locale: 'uk' },
      { params: { wiki: 'wiki' }, locale: mainLanguage },
    ],
    fallback: false,
  };
};

export const getStaticProps = async ({ locale }: Parameters<GetStaticProps>[0]) => {
  const getWikiPage = async (article: string) => {
    const response = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${article}.md`);
    const markdown = await response.text();
    return markdown;
  };

  let markdown;
  if (locale === mainLanguage) {
    markdown = await getWikiPage(mainLanguage);
  } else {
    markdown = await getWikiPage(`uk-${mainLanguage}`);
  }

  return {
    props: {
      markdown,
      ...(await serverSideTranslations(locale ?? 'cz', ['common'])),
    },
  };
};

export default Wiki;
