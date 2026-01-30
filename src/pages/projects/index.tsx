import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

import { PROJECTS, type ProjectBase } from "@/shared/assets";
import { PostLayout, RootLayout } from "@/shared/layouts";
import { getMarkdownContent } from "@/shared/utils/markdown.server";

import ProjectSection from "@/features/projects/components/ProjectSection";

export type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  thumb: string | null;
  icon: string;
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
      icon: p.icon,
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
        <meta name="description" content="개발에 참여한 모든 프로젝트" />
      </Head>
      <RootLayout>
        <section className="flex flex-col">
          <PostLayout
            title="프로젝트"
            description="개발에 참여한 모든 프로젝트"
          >
            <ProjectSection projects={projects} />
          </PostLayout>
        </section>
      </RootLayout>
    </>
  );
}
