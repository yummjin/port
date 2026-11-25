import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { type IconType } from "react-icons";
import {
  RiAppleFill,
  RiGithubFill,
  RiGlobalFill,
  RiGooglePlayFill,
  RiStore2Fill,
} from "react-icons/ri";

import { BackLink } from "@/components/BackLink";
import { DetailHeader, type DetailMetaItem } from "@/components/DetailHeader";
import { Markdown } from "@/components/Markdown";
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

const LINK_ICONS: Record<string, { label: string; Icon: IconType }> = {
  github: { label: "GitHub", Icon: RiGithubFill },
  demo: { label: "Demo", Icon: RiGlobalFill },
  appStore: { label: "App Store", Icon: RiAppleFill },
  playStore: { label: "Google Play", Icon: RiGooglePlayFill },
  oneStore: { label: "ONE store", Icon: RiStore2Fill },
};

export default function ProjectDetailPage({ project }: Props) {
  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  const metaItems: (DetailMetaItem | false | "" | undefined)[] = [
    project.period && { label: "기간", content: project.period },
    project.role && { label: "역할", content: project.role },
    project.stack &&
      project.stack.length > 0 && {
        label: "기술 스택",
        content: project.stack.join(", "),
      },
    links.length > 0 && {
      label: "링크",
      bare: true,
      content: (
        <div className="divide-foreground flex h-full divide-x">
          {links.map(([key, href]) => {
            const { label, Icon } = LINK_ICONS[key] ?? {
              label: key,
              Icon: RiGlobalFill,
            };
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-foreground flex h-full w-9 items-center justify-center transition-opacity hover:opacity-70"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      ),
    },
  ];
  const meta = metaItems.filter((item): item is DetailMetaItem =>
    Boolean(item),
  );

  return (
    <>
      <Head>
        <title>{project.title}</title>
        <meta name="description" content={project.description} />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-12 pb-20">
        <BackLink href="/work" label="Work" className="-mb-6" />
        <DetailHeader
          title={project.title}
          description={project.description}
          meta={meta}
        />

        {project.image[0] && (
          <div className="bg-canvas relative aspect-[2/1] w-full overflow-hidden">
            <Image
              src={project.image[0]}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <Markdown>{project.content}</Markdown>
      </main>
    </>
  );
}
