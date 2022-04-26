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

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const param = params!.article;

  const articles = fs.readFileSync(path.join(process.cwd(), 'articles.json'), { encoding: 'utf-8' });

  const currentWikiPage = (JSON.parse(articles) as string[]).find((article: string) => normalizeWikiPagesUrl(article) === param);

  const response = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${currentWikiPage}.md`);
  if (response.status === 404) {
    return {
      notFound: true,
    };
  }
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

export const getStaticPaths: GetStaticPaths = async () => {
  // list of pages which should not be fetched in nested url ex. wiki/...
  const excludedPages = ['sk', 'cs', 'pl', 'uk-pl', 'uk-cs', 'uk-sk'];

  const mainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT || 'cs';

  /** Recursively finds all internal links and creates paths for pages which should be generated
   *
   * @param articleName - article name to be fetched
   * @param tracking - tracks which articles should be fetched
   * @param paths - list of paths from which pages should be generated
   * @returns
   */
  const fetchWikiArticle = async (articleName: string, tracking: string[], paths: string[]): Promise<string[]> => {
    const response = await fetch(`https://raw.githubusercontent.com/wiki/cesko-digital/movapp/${articleName}.md`);
    const markdown = await response.text();

    const { links } = markdownLinkExtractor(markdown);

    links.forEach((link: string) => {
      if (link.includes('https') || tracking.includes(link) || excludedPages.includes(link)) return;
      paths.push(link);
      tracking = [...tracking, link];
    });

    const nextFetchURL = tracking.shift();
    if (!nextFetchURL) return paths;
    return await fetchWikiArticle(nextFetchURL, tracking, paths);
  };

  const mainLanguageArticles = await fetchWikiArticle(mainLanguage, [], []);
  const ukArticles = await fetchWikiArticle(`uk-${mainLanguage}`, [], []);
  const otherArticles = await fetchWikiArticle('Home', [], []);

  // since we need to normalize articles' name in order to create paths
  // and it is not possible to pass any data through getStaticPaths to getStaticProps besides params
  // we need to create temporary file to extract articles' name in getStaticProps which should be fetched
  fs.writeFileSync(path.join(process.cwd(), 'articles.json'), JSON.stringify([...mainLanguageArticles, ...ukArticles, ...otherArticles]));

  const mainLanguagePaths = mainLanguageArticles.map((article) => ({
    params: { article: normalizeWikiPagesUrl(article), wiki: 'wiki' },
    locale: mainLanguage,
  }));
  const ukLanguagePaths = ukArticles.map((article) => ({
    params: { article: normalizeWikiPagesUrl(article), wiki: 'wiki' },
    locale: 'uk',
  }));
  const otherArticlesPaths = otherArticles.map((article) => ({ params: { wiki: 'wiki', article: normalizeWikiPagesUrl(article) } }));

  const paths = [...mainLanguagePaths, ...ukLanguagePaths, ...otherArticlesPaths];
  return {
    paths,
    fallback: true,
  };
};

export default WikiArticle;
