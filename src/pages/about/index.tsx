import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { PostLayout, RootLayout } from "@/shared/layouts";

const INFO_SECTIONS = [
  { label: "About Me", body: "사용자가 체감하는 변화를 만드는 프론트엔드 개발자입니다." },
  { label: "Career", body: "당근 (2026.05 ~ )" },
  { label: "Experience", body: "기룡아 밥먹자 (2026.05 ~ )" },
] as const;

export default function AboutPage() {
  return (
    <RootLayout>
      <Head>
        <title>소개</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <PostLayout
        title="안녕하세요!"
        description="프론트엔드 개발자 한유진입니다."
      >
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-12 md:flex-row md:items-start">
          <Image
            src="/images/profile.jpeg"
            alt="profile"
            width={300}
            height={400}
            className="rounded-[18px] object-cover"
          />
          <div className="flex flex-1 flex-col gap-8">
            {INFO_SECTIONS.map(({ label, body }) => (
              <div key={label} className="flex flex-col gap-2">
                <span className="text-text-muted text-xs font-medium tracking-[-0.01em] uppercase">
                  {label}
                </span>
                <p className="text-foreground text-base leading-[1.471] tracking-[-0.022em]">
                  {body}
                </p>
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <span className="text-text-muted text-xs font-medium tracking-[-0.01em] uppercase">
                Links
              </span>
              <div className="flex gap-3">
                <Link
                  className="bg-primary inline-flex h-9 items-center rounded-full px-[15px] text-sm font-medium text-white transition-opacity hover:opacity-80"
                  href="https://github.com/yummjin"
                  target="_blank"
                >
                  GitHub
                </Link>
                <Link
                  className="text-subLight border-subLight inline-flex h-9 items-center rounded-full border px-[15px] text-sm font-medium transition-opacity hover:opacity-80"
                  href="https://velog.io/@yummjin/posts"
                  target="_blank"
                >
                  Velog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PostLayout>
    </RootLayout>
  );
}
