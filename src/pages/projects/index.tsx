import { PROJECTS } from "@/shared/data";
import type { ProjectBase } from "@/shared/data";
import { getMarkdownContent } from "@/shared/utils/markdown";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Layout from "@/components/Layout";
import Title from "@/shared/components/Title";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  thumb: string | null;
  mdThumb: string | null;
  mdPeriod: string | null;
  mdStack: string[] | null;
};

export const getStaticProps: GetStaticProps<{
  projects: ProjectListItem[];
}> = async () => {
  const projects: ProjectListItem[] = PROJECTS.map((p) => {
    const md = getMarkdownContent(p.id);
    const mdThumb = (md.data.thumb as string) || null;
    const mdPeriod = (md.data.period as string) || null;
    const mdStack = (md.data.stack as string[]) || null;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      status: p.status,
      thumb: Array.isArray((p as ProjectBase).image)
        ? ((p as ProjectBase).image as string[])[0]
        : null,
      mdThumb,
      mdPeriod,
      mdStack,
    };
  }).sort((a, b) => {
    const parse = (period: string | null) => {
      if (!period) return 0;
      const start = period.split("~")[0]?.trim()?.replace(/\./g, "-");
      const d = new Date(start);
      return d.getTime() || 0;
    };
    return parse(b.mdPeriod) - parse(a.mdPeriod);
  });

  return { props: { projects } };
};

export default function ProjectsPage({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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

            <section className="border-border flex justify-end border-b pb-6">
              <div className="text-text-muted">총 {projects.length}개</div>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="group"
                >
                  <div className="bg-card-background border-border hover:border-accent h-full overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg">
                    {(project.thumb || project.mdThumb) && (
                      <div className="bg-card-background aspect-video w-full overflow-hidden">
                        <Image
                          src={project.thumb || project.mdThumb || ""}
                          alt={project.title}
                          width={500}
                          height={500}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-foreground group-hover:text-accent text-lg font-semibold transition-colors">
                          {project.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                            project.status === "completed"
                              ? "border-status-success-border bg-status-success-bg text-status-success-text border"
                              : "border-status-progress-border bg-status-progress-bg text-status-progress-text border"
                          }`}
                        >
                          {project.status === "completed" ? "완료" : "진행중"}
                        </span>
                      </div>

                      <p className="text-text-muted mb-4 line-clamp-2 text-sm">
                        {project.description}
                      </p>

                      {project.mdStack && project.mdStack.length > 0 && (
                        <div className="mb-4 flex flex-wrap items-center gap-1">
                          {project.mdStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="bg-text-muted text-background rounded px-2 py-1 text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.mdStack.length > 3 && (
                            <span className="text-text-muted ml-2 text-xs">
                              +{project.mdStack.length - 3}개
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {project.mdPeriod && (
                          <span className="text-text-muted text-sm">
                            {project.mdPeriod}
                          </span>
                        )}
                        <div className="text-text-muted group-hover:text-accent flex items-center gap-2 transition-colors">
                          <span className="text-sm text-nowrap">
                            자세히 보기
                          </span>
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
