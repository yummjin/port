import Head from "next/head";
import { useState } from "react";

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
  const [activeTagId, setActiveTagId] = useState<string | null>(tags[0].id);

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
  const response = await fetch(
    "https://velog-scraper.vercel.app/api/v1/series?url=" +
      encodeURIComponent(
        "https://velog.io/@yummjin/series/JavaScript-Deep-Dive",
      ),
  );

  const tagsResponse = await fetch(
    "https://velog-scraper.vercel.app/api/v1/tags?url=" +
      encodeURIComponent("https://velog.io/@yummjin"),
  );

  const [data, tagsData] = await Promise.all([
    response.json(),
    tagsResponse.json(),
  ]);

  return { props: { series: data, tags: tagsData.tags } };
}
