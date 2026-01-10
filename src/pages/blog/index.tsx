import Head from "next/head";
import { useState } from "react";

import { USER_CONFIG } from "@/shared/config/user.config";
import { PostLayout, RootLayout } from "@/shared/layouts";

import { SeriesSection } from "@/features/home";
import { Series, Tag } from "@/features/home/model/series";

export default function BlogPage({
  series,
  tags,
}: {
  series: Series;
  tags: Tag[];
}) {
  const [activeTagId, setActiveTagId] = useState<string | null>(
    tags[0]?.id ?? null,
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
            const isActive = activeTagId === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setActiveTagId(isActive ? null : tag.id)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium focus:outline-none ${
                  isActive
                    ? "text-background bg-white"
                    : "text-background/70 bg-white/50"
                }`}
              >
                {tag.name == "frontend" ? "All" : tag.name}
              </button>
            );
          })}
        </div>
        <SeriesSection series={series} />
      </PostLayout>
    </RootLayout>
  );
}

export async function getStaticProps() {
  const fetchSeries = async () => {
    const response = await fetch(
      `https://velog-scraper.vercel.app/api/v1/series?userId=${USER_CONFIG.velogId}&seriesTitle=JavaScript Deep Dive`,
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
