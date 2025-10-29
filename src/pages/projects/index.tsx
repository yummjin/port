import { PROJECTS } from "@/shared/data";
import Layout from "@/components/Layout";
import Title from "@/shared/components/Title";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

export default function ProjectsPage() {
  return (
    <>
      <Head>
        <title>프로젝트 - 모든 프로젝트</title>
        <meta
          name="description"
          content="개발한 모든 프로젝트를 확인해보세요."
        />
      </Head>
      <Layout>
        <div className="min-h-screen p-6 md:p-12 md:pt-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <Title
              size="lg"
              as="h1"
              subTitle="개발에 참여했던 크고 작은 프로젝트입니다."
            >
              프로젝트
            </Title>

            <section className="flex justify-end border-b border-gray-700 pb-6">
              <div className="text-text-muted">총 {PROJECTS.length}개</div>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="group"
                >
                  <div className="bg-card-background border-border hover:border-accent h-full overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                      <Image
                        src={project.thumb}
                        alt={project.title}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-foreground group-hover:text-accent text-lg font-semibold transition-colors">
                          {project.title}
                        </h3>
                        <span className="bg-card-background border-border text-text-muted flex-shrink-0 rounded-full border px-2 py-1 text-xs">
                          {project.status === "completed" ? "완료" : "진행중"}
                        </span>
                      </div>

                      <p className="text-text-muted mb-4 line-clamp-2 text-sm">
                        {project.description}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-text-muted text-xs">
                            +{project.techStack.length - 3}개
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-text-muted text-sm">
                          {project.period}
                        </span>
                        <div className="text-text-muted group-hover:text-accent flex items-center gap-2 transition-colors">
                          <span className="text-sm">자세히 보기</span>
                          <svg
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
