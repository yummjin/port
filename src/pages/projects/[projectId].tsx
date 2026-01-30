import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PROJECTS } from "@/shared/assets";
import { Title } from "@/shared/components";
import { RootLayout } from "@/shared/layouts";
import { MarkdownData } from "@/shared/utils";
import { getMarkdownContent } from "@/shared/utils/markdown.server";

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

type Project = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  image?: string[];
  links?: {
    github?: string;
    demo?: string;
    appStore?: string;
  };
};

export default function ProjectDetail({
  project,
  markdownData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <RootLayout>
      <Head>
        <title>프로젝트 - {project.title.split(":")[0]}</title>
      </Head>
      <div className="min-h-screen">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 px-6 pt-10">
          {/* {Array.isArray(project.image) && project.image.length > 0 && (
            <div className="grid w-full grid-cols-3 gap-4 md:grid-cols-4">
              {project.image.map((imgSrc, index) => (
                <div
                  key={index}
                  className="group bg-card-background relative h-[180px] w-full cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(imgSrc)}
                >
                  <Image
                    src={imgSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )} */}

          {markdownData.content && (
            <div className="w-full">
              <div className="gap-8 lg:grid lg:grid-cols-7">
                <div className="lg:col-span-5">
                  {Array.isArray(project.image) && project.image.length > 0 && (
                    <div
                      className="group relative mb-10 aspect-[2/1] w-full cursor-pointer overflow-hidden rounded-xl"
                      onClick={() => setSelectedImage(project.image![0])}
                    >
                      <Image
                        src={project.image[0]}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority
                      />
                    </div>
                  )}

                  <ProjectHeader
                    project={project}
                    markdownData={markdownData}
                  />
                  <div className="mt-8 lg:hidden">
                    <ProjectDetails markdownData={markdownData} />
                  </div>
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
                        img: ({ src, alt }) => (
                          <Image
                            src={String(src)}
                            alt={String(alt || "")}
                            className="cursor-zoom-in"
                            onClick={() => src && setSelectedImage(String(src))}
                          />
                        ),
                      }}
                    >
                      {markdownData.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="col-span-2 hidden pt-90 lg:block">
                  <ProjectDetails markdownData={markdownData} />
                </div>
              </div>
            </div>
          )}

          {selectedImage && (
            <div
              className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-h-[90vh] max-w-[90vw]">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="hover:text-foreground absolute -top-10 right-0 text-white"
                >
                  ✕ 닫기
                </button>
                <Image
                  src={selectedImage}
                  alt={project.title}
                  width={1200}
                  height={800}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}

const ProjectHeader = ({
  project,
  markdownData,
}: {
  project: Project;
  markdownData: MarkdownData;
}) => {
  const links = {
    github: project.links?.github,
    demo: project.links?.demo,
    appStore: project.links?.appStore,
  };

  const hasLinks = links.github || links.demo || links.appStore;

  return (
    <header className="flex justify-between gap-8 md:flex-row md:justify-between">
      <div className="space-y-4">
        <Title
          size="xl"
          as="h1"
          subTitle={project.description}
          className="text-text-muted"
        >
          {markdownData.data.title || project.title.split(":")[0]}
        </Title>
      </div>
      {hasLinks && (
        <div className="flex items-start">
          <ProjectLinks links={links} />
        </div>
      )}
    </header>
  );
};

const ProjectDetails = ({ markdownData }: { markdownData: MarkdownData }) => (
  <div className="space-y-8 rounded-2xl border border-white/20 p-6">
    <div>
      <Title size="sm" as="h3" className="text-subLight mb-6">
        프로젝트 정보
      </Title>
      <div className="space-y-4">
        {markdownData.data.period && (
          <InfoItem label="기간" value={String(markdownData.data.period)} />
        )}
        {markdownData.data.role && (
          <InfoItem label="역할" value={String(markdownData.data.role)} />
        )}
      </div>
    </div>

    <div>
      <Title size="sm" as="h3" className="text-subLight mb-4">
        기술 스택
      </Title>
      {Array.isArray(markdownData.data.stack) && (
        <div className="flex flex-wrap gap-2">
          {(markdownData.data.stack as string[]).map((tech: string) => (
            <TechTag key={tech} tech={tech} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-4">
    <span className="text-text-muted min-w-[30px] text-sm font-medium">
      {label}
    </span>
    <span className="text-foreground text-sm">{value}</span>
  </div>
);

const TechTag = ({ tech }: { tech: string }) => (
  <span className="bg-card-background text-foreground rounded-md px-3 py-1 font-mono text-xs transition-colors hover:bg-[color-mix(in_srgb,var(--card-background)_85%,var(--foreground))]">
    {tech}
  </span>
);

type ProjectLinksProps = {
  links: {
    github?: string;
    demo?: string;
    appStore?: string;
  };
};

const ProjectLinks = ({ links }: ProjectLinksProps) => {
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
            className="text-foreground bg-card-background cursor-pointer rounded-full px-4 py-2 text-center text-sm font-medium focus:outline-none"
          >
            <span>{label}</span>
          </a>
        ) : null,
      )}
    </div>
  );
};
