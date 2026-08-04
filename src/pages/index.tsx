import Head from "next/head";

import { PrismaLanding } from "@/features/prisma";

export default function Home() {
  return (
    <>
      <Head>
        <title>Yujin</title>
        <meta
          name="description"
          content="코드를 통해 사용자 일상에 녹아들고자 하는 개발자 Yujin의 포트폴리오입니다."
        />
      </Head>

      <PrismaLanding />
    </>
  );
}
