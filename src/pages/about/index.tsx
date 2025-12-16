import Head from "next/head";

import { PostLayout, RootLayout } from "@/shared/layouts";

export default function AboutPage() {
  return (
    <RootLayout>
      <Head>
        <title>Yujin Han - About</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <PostLayout title="소개" description="">
        소개 내용
      </PostLayout>
    </RootLayout>
  );
}
