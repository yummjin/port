import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { getAllPostSlugs, getPostBySlug, type PostMeta } from "@/lib/posts";

type Props = {
  slug: string;
  meta: Omit<PostMeta, "slug">;
  content: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllPostSlugs().map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = getPostBySlug(params!.slug as string);
  return { props: post };
};

export default function BlogPostPage({
  meta,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>

      <main className="px-content mx-auto flex max-w-[720px] flex-col gap-6 pt-16 pb-20">
        <p className="text-caption text-muted">{meta.date}</p>
        <h1 className="text-section">{meta.title}</h1>

        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(src)} alt={alt ?? ""} loading="lazy" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}
