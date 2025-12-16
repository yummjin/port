import Head from "next/head";

import { PostLayout, RootLayout } from "@/shared/layouts";

import { SeriesSection } from "@/features/home";
import { Series } from "@/features/home/model/series";

export default function BlogPage({ series }: { series: Series }) {
  return (
    <RootLayout>
      <Head>
        <title>yummjin.log</title>
        <meta name="description" content="yummjin.log - blog" />
      </Head>

      <PostLayout title="블로그" description="다양한 기록을 남기고 있습니다">
        <div className="flex gap-2">
          <button className="text-background cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium focus:outline-none">
            All
          </button>
          <button className="text-background cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium focus:outline-none">
            JavaScript
          </button>
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
  const data: Series = await response.json();

  return {
    props: {
      series: data,
    },
  };
}
