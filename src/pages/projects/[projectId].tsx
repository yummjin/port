import { PROJECTS } from "@/shared/data";
import { getMarkdownContent, MarkdownData } from "@/shared/utils/markdown";
import Title from "@/shared/components/Title";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
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

type Project = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  image?: string[];
};

export default function ProjectDetail({
  project,
  markdownData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

          {Array.isArray(project.image) && project.image.length > 0 && (
            <div className="grid w-full grid-cols-3 gap-4 md:grid-cols-4">
              {project.image.map((imgSrc, index) => (
                <div
                  key={index}
                  className="group relative h-[180px] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100"
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
          )}

          <div className="grid gap-16 md:grid-cols-2">
            <ProjectDetails markdownData={markdownData} />
          </div>

          {markdownData.content && (
            <div className="w-full">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="lg:col-span-3">
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
                          <img
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
                <div className="lg:col-span-1">
                  <TableOfContents items={markdownData.tableOfContents} />
                </div>
              </div>
            </div>
          )}

          {/* 이미지 팝업 모달 */}
          {selectedImage && (
            <div
              className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-h-[90vh] max-w-[90vw]">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300"
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
  </header>
);

const ProjectDetails = ({ markdownData }: { markdownData: MarkdownData }) => (
  <div className="space-y-8">
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
