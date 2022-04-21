import fs from 'fs';
import path from 'path';
import React, { useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { normalizeWikiPagesUrl } from 'utils/textNormalizationUtils';
import { visit } from 'unist-util-visit';
import markdownLinkExtractor from 'markdown-link-extractor';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import Head from 'next/head';

const WikiArticle = ({ markdown, title }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const [markdownString, setMarkdownString] = useState('');

  useMemo(() => {
    const markdownText = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(() => (tree) => {
        visit(tree, 'link', (node) => {
          if (!/https/.test(node.url)) {
            node.url = normalizeWikiPagesUrl(node.url);
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
        <title>{title}</title>
        {/* @TODO - add description */}
      </Head>
      <div className="max-w-7xl m-auto" id="markdown" dangerouslySetInnerHTML={{ __html: markdownString }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const param = params!.article;

  const articles = fs.readFileSync(path.join(process.cwd(), 'products.json'), { encoding: 'utf-8' });

  const currentWikiPage = (JSON.parse(articles) as string[]).find((article: string) => normalizeWikiPagesUrl(article) === param);

  const response = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${currentWikiPage}.md`);
  const markdown = await response.text();

  return {
    props: {
      markdown,
      title: currentWikiPage?.replace(/-{1,5}/g, ' '),
      ...(await serverSideTranslations(locale ?? 'cz', ['common'])),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const fetchWikiArticle = async (url: string, tracking: string[], paths: string[]): Promise<string[]> => {
    const res = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${url}.md`);
    const markdown = await res.text();

    const { links } = markdownLinkExtractor(markdown);

    links.forEach((link: string) => {
      if (link.includes('https') || tracking.includes(link)) return;
      paths.push(link);
      tracking = [...tracking, link];
    });

    const nextFetchURL = tracking.shift();
    if (!nextFetchURL) return paths;
    return await fetchWikiArticle(nextFetchURL, tracking, paths);
  };

  const articles = await fetchWikiArticle('Home', [], []);

  // creates temporary file to extract initial artciles' name in getStaticProps
  fs.writeFileSync(path.join(process.cwd(), 'products.json'), JSON.stringify(articles));

  const paths = articles
    .map((article) => locales!.map((locale) => ({ params: { article: normalizeWikiPagesUrl(article) }, locale })))
    .flat();

  return {
    paths,
    fallback: false,
  };
};

export default WikiArticle;
