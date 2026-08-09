import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import { getAllPosts, type PostMeta } from "@/lib/posts";

export const getStaticProps: GetStaticProps<{
  posts: PostMeta[];
}> = async () => {
  return { props: { posts: getAllPosts() } };
};

export default function BlogPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))),
    [posts],
  );
  const visiblePosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <>
      <Head>
        <title>블로그</title>
        <meta name="description" content="Yujin's blog" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-16 pb-20">
        <PageHeader
          title="블로그"
          description="개발과 일상에 대한 기록을 남겨요."
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <TagChip
              label="전체"
              selected={selectedTag === null}
              onClick={() => setSelectedTag(null)}
            />
            {tags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                selected={selectedTag === tag}
                onClick={() => setSelectedTag(tag)}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-10">
          {visiblePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col gap-2 transition-opacity hover:opacity-70"
            >
              <h2 className="text-tile-heading text-link">
                {post.title} →
              </h2>
              <p className="text-caption text-muted">{post.date}</p>
              <p className="text-body-small text-secondary">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

function TagChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-marketing-pill border px-4 py-1.5 text-body-small transition-opacity hover:opacity-80",
        selected
          ? "border-primary bg-primary text-on-primary"
          : "border-border text-secondary",
      )}
    >
      {label}
    </button>
  );
}
