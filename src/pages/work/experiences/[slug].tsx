import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { getAllExperiences, getExperienceBySlug } from "@/lib/experiences";

type Props = ReturnType<typeof getExperienceBySlug>;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllExperiences().map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  return { props: getExperienceBySlug(params!.slug as string) };
};

export default function ExperiencePage({
  title,
  period,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <p className="text-caption text-muted">{period}</p>
        <h1 className="text-section border-muted/50 mb-2 border-b pb-6">
          {title}
        </h1>

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
