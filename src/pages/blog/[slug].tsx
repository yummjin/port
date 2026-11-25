import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";

import { BackLink } from "@/components/BackLink";
import { DetailHeader } from "@/components/DetailHeader";
import { Markdown } from "@/components/Markdown";
import { formatPostDate } from "@/lib/date";
import { getAllPostSlugs, getPostBySlug, type PostMeta } from "@/lib/posts";

type Props = {
  slug: string;
  meta: Omit<PostMeta, "slug" | "thumbnail"> & { displayDate: string };
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
  return {
    props: {
      ...post,
      meta: {
        ...post.meta,
        tags: post.meta.tags ?? [],
        displayDate: formatPostDate(post.meta.date),
      },
    },
  };
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

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-12 pb-20">
        <BackLink href="/blog" label="Blog" className="-mb-6" />
        <DetailHeader
          title={meta.title}
          description={meta.description}
          meta={[
            { label: "작성일", content: meta.displayDate },
            ...(meta.tags.length > 0
              ? [{ label: "태그", content: meta.tags.join(", ") }]
              : []),
          ]}
        />

        <Markdown>{content}</Markdown>
      </main>
    </>
  );
}
