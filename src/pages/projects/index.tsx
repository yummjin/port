import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { PROJECTS } from "@/shared/data";
import type { ProjectBase } from "@/shared/data";
import { getMarkdownContent } from "@/shared/utils/markdown";

import Layout from "@/components/Layout";

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
        <section className="flex flex-col">
          <header className="bg-background/70 fixed top-0 z-50 flex w-full flex-col backdrop-blur-xl">
            <div className="box-border flex h-14 items-center justify-between">
              프로젝트
            </div>
            <div className="flex items-center gap-2 py-3">
              <span className="text-background flex h-[32px] w-fit items-center justify-center rounded-[8px] bg-white px-3 text-sm font-medium">
                전체
              </span>
              <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
                프로젝트
              </span>
              <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
                기술스택
              </span>
            </div>
          </header>
          <div className="scrollbar-hide mt-32">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <VideoCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

const VideoCard = ({ project }: { project: ProjectListItem }) => (
  <Link href={`/projects/${project.id}`} className="flex flex-col gap-3">
    <div className="bg-card-background h-[40vh] max-h-[240px] min-h-[170px] overflow-hidden rounded-[10px]">
      <Image
        src={project.thumb || ""}
        alt={project.title}
        width={500}
        height={500}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex items-start gap-3">
      <div className="size-9 rounded-full bg-white" />
      <div className="flex flex-col gap-0.5 font-semibold">
        <p>{project.title}</p>
        <p className="text-text-muted text-sm">{project.description}</p>
        <p className="text-text-muted text-sm">{project.mdPeriod}</p>
      </div>
    </div>
  </Link>
);
