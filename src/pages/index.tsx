import Head from "next/head";

import Layout from "@/components/Layout";
import PostLayout from "@/components/PostLayout";

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
        <PostLayout>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">
              안녕하세요! 프론트엔드 개발자 한유진입니다.
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <VideoCard />
              <VideoCard />
              <VideoCard />
              <VideoCard />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">구현했던 화면들이에요</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <VideoCard />
              <VideoCard />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">사용한 기술스택들이에요</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <VideoCard />
              <VideoCard />
            </div>
          </div>
        </PostLayout>
      </section>
    </Layout>
  );
}

const VideoCard = () => (
  <div className="flex flex-col gap-3">
    <div className="bg-card-background h-[40vh] max-h-[240px] min-h-[170px] rounded-[10px] p-4">
      <div className="flex items-center gap-2"></div>
    </div>
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-full bg-white" />
      <div className="flex flex-col gap-0.5 font-semibold">
        <p>주토피아 보고 왔어요</p>
        <p className="text-text-muted text-sm">너무 귀엽더라구용</p>
        <p className="text-text-muted text-sm">2025.12.07</p>
      </div>
    </div>
  </div>
);
