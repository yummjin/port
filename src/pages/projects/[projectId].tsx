import { PROJECTS } from "@/shared/data";
import { getMarkdownContent, MarkdownData } from "@/shared/utils/markdown";
import Title from "@/shared/components/Title";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TableOfContents from "@/components/TableOfContents";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { projectId } = context.params || {};
  const project = PROJECTS.find((p) => p.id === projectId) as Project;
  const markdownData = getMarkdownContent(projectId as string);

  return {
    props: {
      projectId,
      project: project,
      markdownData,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: PROJECTS.map(({ id }) => ({ params: { projectId: id } })),
    fallback: false,
  };
};

type ProjectLink = {
  github?: string;
  demo?: string;
  appStore?: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  period: string;
  role: string;
  teamSize: string;
  techStack: string[];
  achievements: string[];
  links: ProjectLink;
  image: string[];
  myContribution?: string;
  status: "completed" | "in_progress";
};

export default function ProjectDetail({
  project,
  markdownData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>프로젝트 - {project.title.split(":")[0]}</title>
      </Head>
      <div className="min-h-screen p-6 md:p-12 md:pt-8">
        <button
          onClick={() => {
            router.push("/projects");
          }}
          className="cursor-pointer py-4 font-mono outline-none hover:underline active:underline"
        >
          go back
        </button>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-8 md:pt-12">
          <ProjectHeader project={project} markdownData={markdownData} />

          <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3">
            {project.image.map((imgSrc, index) => (
              <ProjectImage key={index} src={imgSrc} alt={project.title} />
            ))}
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            <ProjectDetails project={project} markdownData={markdownData} />
            <AchievementsList achievements={project.achievements} />
          </div>

          {markdownData.content && (
            <div className="w-full">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8">
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h1 id={id}>{children}</h1>;
                          },
                          h2: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h2 id={id}>{children}</h2>;
                          },
                          h3: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h3 id={id}>{children}</h3>;
                          },
                          h4: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h4 id={id}>{children}</h4>;
                          },
                          h5: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h5 id={id}>{children}</h5>;
                          },
                          h6: ({ children }) => {
                            const id = children
                              ?.toString()
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/--+/g, "-")
                              .trim();
                            return <h6 id={id}>{children}</h6>;
                          },
                        }}
                      >
                        {markdownData.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <TableOfContents items={markdownData.tableOfContents} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const ProjectHeader = ({
  project,
  markdownData,
}: {
  project: Project;
  markdownData: MarkdownData;
}) => (
  <header className="flex flex-col gap-8 md:flex-row md:justify-between">
    <div className="space-y-4">
      <Title
        size="3xl"
        as="h1"
        subTitle={project.description}
        className="text-gray-400"
      >
        {markdownData.data.title || project.title.split(":")[0]}
      </Title>
    </div>
    <div className="flex items-start">
      <ProjectLinks links={project.links} />
    </div>
  </header>
);

const ProjectDetails = ({
  project,
  markdownData,
}: {
  project: Project;
  markdownData: MarkdownData;
}) => (
  <div className="space-y-8">
    <div>
      <Title size="sm" as="h3" className="text-subLight mb-6">
        프로젝트 정보
      </Title>
      <div className="space-y-4">
        <InfoItem
          label="기간"
          value={markdownData.data.period || project.period}
        />
        <InfoItem label="역할" value={markdownData.data.role || project.role} />
        <InfoItem label="팀 구성" value={project.teamSize} />
      </div>
    </div>

    <div>
      <Title size="sm" as="h3" className="text-subLight mb-4">
        기술 스택
      </Title>
      <div className="flex flex-wrap gap-2">
        {(markdownData.data.stack || project.techStack).map((tech: string) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </div>
    </div>
  </div>
);

const AchievementsList = ({ achievements }: { achievements: string[] }) => (
  <div>
    <Title size="sm" as="h3" className="text-subLight mb-6">
      주요 성과
    </Title>
    <ul className="space-y-3">
      {achievements.map((achievement, index) => (
        <AchievementItem key={index} achievement={achievement} />
      ))}
    </ul>
  </div>
);

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="group relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-100">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
);

const ProjectLinks = ({ links }: { links: ProjectLink }) => {
  const linkConfig = [
    { key: "github", label: "GitHub", href: links.github },
    { key: "demo", label: "Demo", href: links.demo },
    { key: "appstore", label: "App Store", href: links.appStore },
  ];

  return (
    <div className="flex flex-col gap-3">
      {linkConfig.map(({ key, label, href }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:border-subLight flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm transition-all hover:bg-gray-700"
          >
            <span>{label}</span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        ) : null,
      )}
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <span className="min-w-[80px] text-sm font-medium text-gray-500">
      {label}
    </span>
    <span className="text-gray-300">{value}</span>
  </div>
);

const TechTag = ({ tech }: { tech: string }) => (
  <span className="rounded-md bg-gray-800 px-3 py-1 font-mono text-xs text-gray-300 transition-colors hover:bg-gray-700">
    {tech}
  </span>
);

const AchievementItem = ({ achievement }: { achievement: string }) => (
  <li className="flex items-start gap-3">
    <div className="bg-subLight mt-2 size-2 flex-shrink-0 rounded-full" />
    <span className="leading-relaxed text-gray-300">{achievement}</span>
  </li>
);
