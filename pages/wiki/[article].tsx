import { readdirSync, readFileSync } from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import path from 'path';
import React, { useMemo, useState } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { visit } from 'unist-util-visit';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

const normalizeUrl = (url: string) => {
  return url
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/--{1,5}/g, '-');
};

const Wiki = ({ markdownText }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const [markdownString, setMarkdownString] = useState<any>(null);

  useMemo(() => {
    const markdown = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(() => (tree) => {
        visit(tree, 'link', (node: any) => {
          if (!/https/.test(node.url)) {
            node.url = normalizeUrl(node.url);
          }
        });
      })
      .use(remarkRehype)
      .use(rehypeExternalLinks)
      .use(rehypeStringify)
      .processSync(markdownText)
      .toString();

    setMarkdownString(markdown);
  }, [markdownText]);

  return <div className="max-w-7xl m-auto" id="Markdown" dangerouslySetInnerHTML={{ __html: markdownString }}></div>;
};
[];

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  let markdownText;
  const wikiFiles = readdirSync(path.resolve(process.cwd(), 'movapp.wiki'));

  wikiFiles.forEach((filename) => {
    const normalizedFileName = normalizeUrl(filename.replace(/.md/g, ''));
    if (normalizedFileName === (params as { article: string }).article) {
      const filePath = path.resolve(process.cwd(), `movapp.wiki/${filename}`);
      markdownText = readFileSync(filePath, 'utf-8');
    }
  });

  return {
    props: {
      markdownText,
      ...(await serverSideTranslations(locale ?? 'cz', ['common'])),
    },
  };
};

export const getStaticPaths = async () => {
  const wikiFiles = readdirSync(path.resolve(process.cwd(), 'movapp.wiki'));

  const paths = wikiFiles
    .filter((filename) => {
      return filename !== '.git';
    })
    .map((filename) => ({ params: { article: normalizeUrl(filename.replace(/.md/g, '')) } }));
  return {
    paths,
    fallback: false,
  };
};

export default Wiki;
