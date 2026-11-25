import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import { getAllPosts, type PostMeta } from "@/lib/posts";

type ViewMode = "grid" | "list";

export const getStaticProps: GetStaticProps<{
  posts: PostMeta[];
}> = async () => {
  return { props: { posts: getAllPosts() } };
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
  timeZone: "UTC",
});

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormatter.format(parsed);
}

export default function BlogPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");

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

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-12 pb-20">
        <PageHeader
          title="블로그"
          description="개발과 일상에 대한 기록을 남겨요."
        />

        <div>
          <div className="border-foreground flex items-end justify-between gap-4 border-b">
            <div className="flex flex-wrap gap-x-4 gap-y-1 pb-1">
              <FilterTab
                label="전체"
                selected={selectedTag === null}
                onClick={() => setSelectedTag(null)}
              />
              {tags.map((tag) => (
                <FilterTab
                  key={tag}
                  label={tag}
                  selected={selectedTag === tag}
                  onClick={() => setSelectedTag(tag)}
                />
              ))}
            </div>

            <div
              role="group"
              aria-label="보기 방식"
              className="border-foreground flex shrink-0 border border-b-0"
            >
              <ViewToggle
                label="GRID"
                selected={view === "grid"}
                onClick={() => setView("grid")}
              />
              <ViewToggle
                label="LIST"
                selected={view === "list"}
                onClick={() => setView("list")}
                className="border-foreground border-l"
              />
            </div>
          </div>

          {view === "list" ? (
            <ul>
              {visiblePosts.map((post) => (
                <li key={post.slug} className="border-foreground border-b">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex gap-6 py-5 transition-opacity duration-200 hover:opacity-70"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <h2 className="text-tile-heading sm:text-section text-foreground">
                        {post.title}
                      </h2>
                      <p className="text-body-small sm:text-body text-muted">
                        {formatDate(post.date)}
                      </p>
                      <p className="text-body-small sm:text-body text-muted mt-auto pt-4">
                        {post.description}
                      </p>
                    </div>
                    <Thumbnail
                      src={post.thumbnail}
                      className="size-24 shrink-0 sm:size-40"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 pt-5 sm:grid-cols-3">
              {visiblePosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col gap-2 transition-opacity duration-200 hover:opacity-70"
                  >
                    <Thumbnail
                      src={post.thumbnail}
                      className="aspect-square w-full"
                    />
                    <h2 className="text-tile-heading text-foreground mt-1">
                      {post.title}
                    </h2>
                    <p className="text-caption text-muted">
                      {formatDate(post.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

function Thumbnail({
  src,
  className,
}: {
  src: string | null;
  className?: string;
}) {
  return (
    <div className={cn("bg-canvas overflow-hidden", className)}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

function FilterTab({
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
      aria-pressed={selected}
      className={cn(
        "text-body cursor-pointer transition-colors duration-150",
        selected ? "text-foreground" : "text-muted hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ViewToggle({
  label,
  selected,
  onClick,
  className,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "text-body cursor-pointer px-1.5 py-[0.5px] transition-colors duration-150",
        selected ? "text-foreground" : "text-muted hover:text-foreground",
        className,
      )}
    >
      {label}
    </button>
  );
}
