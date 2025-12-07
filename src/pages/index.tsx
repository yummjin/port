import Head from "next/head";

import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>한유진 - Frontend Developer</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <section className="flex flex-col">
        <header className="bg-background/70 fixed top-0 z-50 flex w-full flex-col backdrop-blur-xl">
          <div className="box-border flex h-14 items-center justify-between">
            안녕하세요! 프론트엔드 개발자 한유진입니다.
          </div>
          <div className="flex items-center gap-2 py-3">
            <span className="text-background flex h-[32px] w-fit items-center justify-center rounded-[8px] bg-white px-3 text-sm font-medium">
              전체
            </span>
            <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
              프로젝트
            </span>
            <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
              기술스택
            </span>
          </div>
        </header>

        <div className="scrollbar-hide mt-32">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
        </div>
      </section>
    </Layout>
  );
}

const VideoCard = () => (
  <div className="flex flex-col gap-3">
    <div className="bg-card-background h-[40vh] max-h-[240px] min-h-[170px] rounded-[10px] p-4">
      <div className="flex items-center gap-2">gd</div>
    </div>
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-full bg-white" />
      <div className="flex flex-col gap-0.5 font-semibold">
        <p>주토피아 보고 왔어요</p>
        <p className="text-text-muted text-sm">주토피아 존나 재밋음</p>
        <p className="text-text-muted text-sm">2025.12.07</p>
      </div>
    </div>
  </div>
);
