import Head from "next/head";

import { PostLayout, RootLayout } from "@/shared/layouts";

export default function PlaygroundPage() {
  return (
    <RootLayout>
      <Head>
        <title>플레이그라운드</title>
        <meta
          name="description"
          content="한유진의 실험적인 작업과 프로토타입을 모아둔 공간입니다"
        />
      </Head>

      <PostLayout title="Playground" description="준비 중입니다.">
        <p className="text-text-muted mx-auto max-w-[600px] text-center text-sm leading-relaxed">
          곧 다양한 실험과 프로토타입으로 채워질 예정입니다.
        </p>
      </PostLayout>
    </RootLayout>
  );
}
