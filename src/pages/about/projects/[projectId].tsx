import Card from "@/shared/components/Card";
import { PROJECTS } from "@/shared/data";
import { geistMono, geistSans, gothicA1 } from "@/styles/font";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { projectId } = context.params || {};
  const project = PROJECTS.find((p) => p.id === projectId) as Project;
  return {
    props: {
      projectId,
      project: project,
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
  playstore?: string;
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
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>프로젝트 - {project.title.split(":")[0]}</title>
      </Head>
      <div
        className={`${geistMono.variable} ${geistSans.variable} ${gothicA1.variable} p-5 md:pt-5 md:p-10`}
      >
        <button
          onClick={() => {
            router.back();
          }}
          className="hover:underline active:underline outline-none cursor-pointer font-mono py-4"
        >
          go back
        </button>
        <div className="md:w-5/6 w-full flex flex-col gap-4 pt-5 md:pt-10">
          <ProjectHeader project={project} />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {project.image.map((imgSrc, index) => (
              <ProjectImage key={index} src={imgSrc} alt={project.title} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
            <ProjectDetails project={project} />
            <AchievementsList achievements={project.achievements} />
          </div>

        </div>
      </div>
    </>
  );
}

const ProjectHeader = ({ project }: { project: Project }) => (
  <header className="flex justify-between">
    <div className="space-y-1"><h2 className="tracking-tight font-mono text-4xl font-bold leading-tight">
      {project.title.split(":")[0]}
    </h2>
      <p className="leading-relaxed">{project.description}</p></div>
    <ProjectLinks links={project.links} />

  </header>
);

const ProjectDetails = ({ project }: { project: Project }) => (
  <Card className="w-full text-black">
    <InfoItem label="기간" value={project.period} />
    <InfoItem label="역할" value={project.role} />
    <div className="flex items-start gap-3">
      <p className="text-nowrap text-main font-medium">기술 스택</p>
      <p className="flex flex-wrap gap-2">
        {project.techStack.map((tech: string) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </p>
    </div>
    <InfoItem label="팀 구성" value={project.teamSize} />
  </Card>
);

const AchievementsList = ({ achievements }: { achievements: string[] }) => (
  <Card className="size-full">
    <ul className="space-y-1">
      {achievements.map((achievement, index) => (
        <AchievementItem key={index} achievement={achievement} />
      ))}
    </ul>
  </Card>
);

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full h-[200px] overflow-hidden">
    <Image src={src} alt={alt} fill className="object-cover" />
  </div>
);

const ProjectLinks = ({ links }: { links: ProjectLink }) => {
  const linkConfig = [
    { key: "github", label: "gitHub", href: links.github },
    { key: "demo", label: "demo", href: links.demo },
    { key: "playstore", label: "playStore", href: links.playstore },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {linkConfig.map(({ key, label, href }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-point-dot text-xl hover:text-main"
          >
            {label} {`->`}
          </a>
        ) : null
      )}
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <p className="text-nowrap text-main font-medium">{label}</p>
    <p>{value}</p>
  </div>
);

const TechTag = ({ tech }: { tech: string }) => (
  <span className="px-1 py-0.5 bg-gray-100 text-gray-600 font-mono text-xs">
    {tech}
  </span>
);

const AchievementItem = ({ achievement }: { achievement: string }) => (
  <li className="flex gap-3 group items-center">
    <div className="size-2 bg-gray-200 rounded-full flex-shrink-0" />
    <span className="text-gray-700">{achievement}</span>
  </li>
);
