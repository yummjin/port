import Head from "next/head";

import { RootLayout } from "@/shared/layouts";

export default function Home() {
  return (
    <RootLayout>
      <Head>
        <title>yummjin</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <section className="relative flex h-[calc(100vh-88px)] w-full flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
        <div className="from-background to-background pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent" />
        <div
          className="absolute right-1/2 bottom-0 mx-auto w-[200vw] rounded-[50%] border border-[0.5px] border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.3),0_0_100px_rgba(255,255,255,0.4)]"
          style={{
            height: "100vw",
            transform: "translateX(50%) translateY(65%)",
          }}
        />
      </section>
    </RootLayout>
  );
}
