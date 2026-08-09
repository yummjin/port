import Head from "next/head";
import Link from "next/link";

import { LinkButton } from "@/components/Button";
import { getAllPosts, type PostMeta } from "@/lib/posts";

export const getStaticProps = async () => {
  return { props: { posts: getAllPosts().slice(0, 3) } };
};

export default function Home({ posts }: { posts: PostMeta[] }) {
  return (
    <>
      <Head>
        <title>Yujin</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진입니다."
        />
      </Head>

      <section className="dark relative flex h-screen flex-col justify-end gap-6 overflow-hidden px-content pb-24">
        <video
          className="hero-media absolute inset-0 -z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_132328_5f9029c8-218f-4489-82b6-29ff2849920e.png"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4"
        />

        <div className="m-auto flex w-full max-w-[1000px] flex-col gap-6">
          <p className="text-body text-secondary">프론트엔드 개발자 한유진입니다!</p>
          <h1 className="text-display-hero text-foreground font-bold">
            <HeroLine words={["일상에", "녹아드는"]} startDelay={0} />
            <HeroLine words={["개발을", "해요"]} startDelay={2} />
          </h1>
          <p className="text-body text-secondary max-w-[560px]">
            항상 제품 중심으로 사고하고, 사용자가 우선이에요.<br />
            코드를 통해 일상에 녹아드는 제품을 만드는 개발자가 되려고 노력해요.
          </p>

          <div className="mt-4 flex gap-3">
            <LinkButton href="/projects" variant="primary">
              프로젝트 보기
            </LinkButton>
            <LinkButton href="/blog" variant="outline">
              블로그 보기
            </LinkButton>
          </div>
        </div>
      </section>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-24 pt-24 pb-20">
        <section className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-tile-heading">블로그</h2>
            <Link href="/blog" className="text-link text-body-small">
              전체보기 →
            </Link>
          </div>

          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-2 transition-opacity hover:opacity-70"
              >
                <h3 className="text-tile-heading text-link">
                  {post.title} →
                </h3>
                <p className="text-caption text-muted">{post.date}</p>
                <p className="text-body-small text-secondary">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function HeroLine({
  words,
  startDelay,
}: {
  words: string[];
  startDelay: number;
}) {
  return (
    <span className="flex flex-wrap gap-x-3">
      {words.map((word, i) => (
        <span key={word} className="hero-word">
          <span
            className="hero-word-inner"
            style={{ animationDelay: `${(startDelay + i) * 80}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
