import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { LinkButton } from "@/components/Button";
import { getAllPosts, type PostMeta } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";

export const getStaticProps = async () => {
  return {
    props: {
      posts: getAllPosts().slice(0, 4),
      projects: getAllProjects().slice(0, 5),
    },
  };
};

export default function Home({
  posts,
  projects,
}: {
  posts: PostMeta[];
  projects: ReturnType<typeof getAllProjects>;
}) {
  return (
    <>
      <Head>
        <title>Yujin</title>
        <meta name="description" content="프론트엔드 개발자 한유진입니다." />
      </Head>

      <section>
        <div className="px-content mx-auto max-w-[1000px] py-12 md:py-20">
          <div className="relative mb-6 h-[400px] w-full overflow-hidden">
            <Image
              src="/images/hero.webp"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-body-small text-muted mb-4">Frontend Developer</p>
          <h1 className="text-body">
            안녕하세요! 프론트엔드 개발자 한유진이에요.
          </h1>
          <p className="text-body text-secondary mb-10 max-w-[480px]">
            사용자를 먼저 생각하며, 일상에 녹아드는 제품을 만들어요.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/work" variant="primary">
              작업 보기
            </LinkButton>
            <LinkButton href="/blog" variant="outline">
              블로그 보기
            </LinkButton>
          </div>
        </div>
      </section>

      <section>
        <div className="px-content mx-auto max-w-[1000px] py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-tile-heading">블로그</h2>
            <Link href="/blog" className="text-link text-body-small">
              전체보기 →
            </Link>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex aspect-square w-full flex-col gap-2 border-[0.5px] border-black p-4 transition-opacity hover:opacity-70 dark:border-white/60"
                >
                  <h3 className="text-tile-heading text-link">
                    {post.title} →
                  </h3>
                  <p className="text-body-small text-secondary">
                    {post.description}
                  </p>
                  <p className="text-caption text-muted mt-auto w-fit border-[0.5px] border-black px-1.5 py-0.5 dark:border-white/60">
                    {post.date}
                  </p>
                </Link>
              ))}
            </div>
            {posts[3] && (
              <Link
                href={`/blog/${posts[3].slug}`}
                className="flex flex-col justify-between gap-2 border-[0.5px] border-black p-5 transition-opacity hover:opacity-70 dark:border-white/60"
              >
                <h3 className="text-tile-heading text-link">
                  {posts[3].title} →
                </h3>

                <p className="text-body-small text-secondary">
                  {posts[3].description}
                </p>
                <p className="text-caption text-muted mt-6 w-fit border-[0.5px] border-black px-1.5 py-0.5 dark:border-white/60">
                  {posts[3].date}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="px-content mx-auto max-w-[600px] pt-16 pb-30">
          <h2 className="text-tile-heading mb-8">프로젝트</h2>
          <div className="grid max-w-[600px] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="card-rise group flex flex-col gap-2"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="aspect-square w-full border-[0.5px] border-black p-4 transition-opacity group-hover:opacity-80 dark:border-white/60">
                  <Image src={project.icon} alt="" width={48} height={48} />
                </div>
                <p className="text-body-small text-foreground leading-snug font-medium">
                  {project.title}
                </p>
                <p className="text-caption text-muted mt-[-6px] line-clamp-1">
                  {project.description}
                </p>
              </Link>
            ))}

            {/* 전체보기 원형 버튼 */}
            <Link
              href="/work"
              className="card-rise flex items-center justify-center"
              style={{ animationDelay: `${projects.length * 80}ms` }}
            >
              <div className="border-foreground text-foreground flex aspect-square w-4/5 items-center justify-center rounded-full border text-center transition-opacity hover:opacity-60">
                <span className="text-body-small leading-snug">전체보기</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
