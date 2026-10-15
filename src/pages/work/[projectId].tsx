import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { Card } from "@/components/Card";
import {
  getAllProjectIds,
  getProjectById,
  type ProjectMeta,
} from "@/lib/projects";

type Props = {
  project: ProjectMeta & {
    period?: string;
    role?: string;
    stack?: string[];
    content: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllProjectIds().map((id) => ({ params: { projectId: id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const project = getProjectById(params!.projectId as string);
  if (!project) return { notFound: true };
  return { props: { project } };
};

const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  demo: "Demo",
  appStore: "App Store",
  playStore: "Google Play",
  oneStore: "ONE store",
};

export default function ProjectDetailPage({ project }: Props) {
  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-12 pb-20">
        <div>
          <p className="text-body-small text-muted">{project.description}</p>
          <h1 className="text-section mt-2">{project.title}</h1>
        </div>

        <Card className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_2fr_auto]">
          {project.period && (
            <div>
              <p className="text-caption text-muted mb-1">기간</p>
              <p className="text-body-small">{project.period}</p>
            </div>
          )}
          {project.role && (
            <div>
              <p className="text-caption text-muted mb-1">역할</p>
              <p className="text-body-small">{project.role}</p>
            </div>
          )}
          {project.stack && project.stack.length > 0 && (
            <div>
              <p className="text-caption text-muted mb-2">기술 스택</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-canvas text-caption rounded-control px-2 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.links && (
            <div className="flex flex-col gap-2">
              {Object.entries(project.links).map(([key, href]) =>
                href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link text-body-small"
                  >
                    {LINK_LABELS[key] ?? key} →
                  </a>
                ) : null,
              )}
            </div>
          )}
        </Card>

        {project.image[0] && (
          <div className="bg-canvas rounded-docs-card relative aspect-[2/1] w-full overflow-hidden">
            <Image
              src={project.image[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {project.content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}
