import Head from "next/head";
import { useState } from "react";

import { USER_CONFIG } from "@/shared/config/user.config";
import { PostLayout, RootLayout } from "@/shared/layouts";
import { capitalize } from "@/shared/utils";

import { SeriesSection } from "@/features/home";
import { Post, Series, Tag } from "@/features/home/model/series";

export default function BlogPage({
  series,
  tags,
}: {
  series: Series;
  tags: Tag[];
}) {
  const [activeTagName, setActiveTagName] = useState<string | null>(
    tags[0]?.name ?? null,
  );

  return (
    <RootLayout>
      <Head>
        <title>블로그</title>
        <meta name="description" content="yummjin.log - blog" />
      </Head>

      <PostLayout title="블로그" description="다양한 기록을 남기고 있습니다">
        <div className="flex gap-2">
          {tags.map((tag) => {
            const isActive = activeTagName === tag.name;
            return (
              <button
                key={tag.id}
                onClick={() => setActiveTagName(isActive ? null : tag.name)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium focus:outline-none ${
                  isActive ? "text-background bg-white" : "text-white"
                }`}
              >
                {tag.name === "frontend" ? "All" : capitalize(tag.name)}
              </button>
            );
          })}
        </div>
        <SeriesSection
          activeTagName={activeTagName}
          posts={series.contents.filter((content: Post) =>
            content.title.includes(
              capitalize(
                activeTagName === "frontend" ? "" : (activeTagName ?? ""),
              ),
            ),
          )}
        />
      </PostLayout>
    </RootLayout>
  );
}

export async function getStaticProps() {
  const fetchSeries = async () => {
    const response = await fetch(
      `https://velog-scraper.vercel.app/api/v1/post-all?userId=yummjin`,
    );
    return response.json();
  };

  const fetchTags = async (): Promise<{ tags: Tag[] }> => {
    try {
      const response = await fetch(
        `https://velog-scraper.vercel.app/api/v1/tags?userId=${USER_CONFIG.velogId}`,
      );
      const data = await response.json();
      return data as { tags: Tag[] };
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return { tags: [] };
    }
  };

  const [series, tags] = await Promise.all([fetchSeries(), fetchTags()]);

  return { props: { series, tags: tags.tags } };
}
