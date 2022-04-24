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
import { useRouter } from 'next/router';

const WikiArticle = ({ markdown, title }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const [markdownString, setMarkdownString] = useState('');
  const [seoTitle, setSEOTitle] = useState(title);
  const router = useRouter();

  useMemo(() => {
    const markdownText = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(() => (tree) => {
        // normalizes all internal urls to create correct links
        visit(tree, 'link', (node) => {
          if (!/https/.test(node.url)) {
            node.url = normalizeWikiPagesUrl(node.url);
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

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
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

export const getStaticProps = async ({ params, locale }: Parameters<GetStaticProps>[0]) => {
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
  // list of pages which should not be fetched when certain locale is used
  const excludedPages = {
    cs: ['sk', 'uk-sk', 'pl', 'uk-pl'],
    sk: ['cs', 'uk-cs', 'pl', 'uk-pl'],
    pl: ['cs', 'uk-cs', 'sk', 'uk-sk'],
  };
  const mainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT || 'cs';

  /** Recursively finds all internal links and creates paths for pages which should be generated
   *
   * @param articleName - article name to be fetched
   * @param tracking - tracks which articles which should be fetched
   * @param paths - list of paths from which pages should be generated
   * @returns
   */
  const fetchWikiArticle = async (articleName: string, tracking: string[], paths: string[]): Promise<string[]> => {
    const res = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${articleName}.md`);
    const markdown = await res.text();

    const { links } = markdownLinkExtractor(markdown);

    links.forEach((link: string) => {
      if (link.includes('https') || tracking.includes(link) || excludedPages[mainLanguage as 'cs' | 'pl' | 'sk'].includes(link)) return;
      paths.push(link);
      tracking = [...tracking, link];
    });

    const nextFetchURL = tracking.shift();
    if (!nextFetchURL) return paths;
    return await fetchWikiArticle(nextFetchURL, tracking, paths);
  };

  const articles = await fetchWikiArticle('Home', [], []);

  // since we need to normalize articles' name in order to create paths
  // and it is not possible to pass any data through getStaticPaths to getStaticProps besides params
  // we need to create temporary file to extract articles' name in getStaticProps which should be fetched
  fs.writeFileSync(path.join(process.cwd(), 'products.json'), JSON.stringify(articles));

  const paths = articles
    .map((article) => locales!.map((locale) => ({ params: { article: normalizeWikiPagesUrl(article) }, locale })))
    .flat();

  return {
    paths,
    fallback: true,
  };
};

export default WikiArticle;
