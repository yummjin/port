import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Title } from "@/shared/components";
import { PostLayout, RootLayout } from "@/shared/layouts";
import { cn } from "@/shared/utils";

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
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-12">
          <Image
            src="/images/profile.jpeg"
            alt="profile"
            width={300}
            height={400}
            className="rounded-md object-cover"
          />
          <div className="flex flex-col gap-6">
            <div>
              <Title
                size="sm"
                as="h2"
                className="mb-1 border-b border-white/20 pb-1"
              >
                About Me
              </Title>
              <p className="leading-loose">
                사용자가 체감하는 변화를 만드는 프론트엔드 개발자입니다.
              </p>
            </div>
            <div>
              <Title
                size="sm"
                as="h2"
                className="mb-1 border-b border-white/20 pb-1"
              >
                Career
              </Title>
              <p className="leading-loose">당근 (2026.05 ~ )</p>
            </div>
            <div>
              <Title
                size="sm"
                as="h2"
                className="mb-1 border-b border-white/20 pb-1"
              >
                Experience
              </Title>
              <p className="leading-loose">기룡아 밥먹자 (2026.05 ~ )</p>
            </div>
            <div>
              <Title
                size="sm"
                as="h2"
                className="mb-1 border-b border-white/20 pb-1"
              >
                Links
              </Title>
              <div className="mt-2 flex gap-4">
                <Link
                  className="text-foreground hover:text-subLight underline underline-offset-4"
                  href="https://github.com/yummjin"
                  target="_blank"
                >
                  GitHub
                </Link>
                <Link
                  className="text-foreground hover:text-subLight underline underline-offset-4"
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
