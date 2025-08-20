import { AboutLayout } from "@/shared/layouts";
import { PROJECTS } from "@/shared/data/project";
import React, { useState } from "react";
import Timeline from "@/widgets/menu/TimeLine";
import Image from "next/image";

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
};

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
            className="font-mono underline hover:text-main"
          >
            {label}
          </a>
        ) : null
      )}
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <p className="text-sm text-nowrap text-main font-medium">{label}</p>
    <p className="text-gray-800 font-semibold">{value}</p>
  </div>
);

// 기술 스택 태그 컴포넌트
const TechTag = ({ tech }: { tech: string }) => (
  <span className="px-1 py-0.5 bg-gray-200 text-gray-600 text-xs">{tech}</span>
);

const AchievementItem = ({ achievement }: { achievement: string }) => (
  <li className="flex gap-3 group items-center">
    <div className="size-3 bg-gray-200 rounded-full flex-shrink-0" />
    <span className="text-gray-700">{achievement}</span>
  </li>
);

const ProjectHeader = ({ project }: { project: Project }) => (
  <header className="space-y-1">
    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
      {project.title}
    </h2>
    <div className="flex items-center gap-2">
      <p className="font-semibold text-lg">{project.period}</p>
    </div>
    <p className="text-gray-700 text-lg leading-relaxed">
      {project.description}
    </p>
    <ProjectLinks links={project.links} />
  </header>
);

const ProjectInfo = ({ project }: { project: Project }) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-5">
      <InfoItem label="역할" value={project.role} />
      <InfoItem label="팀 구성" value={project.teamSize} />
    </div>
    <div className="flex items-center gap-3">
      <p className="text-sm text-nowrap text-main font-medium">기술 스택</p>
      <p className="flex flex-wrap gap-2">
        {project.techStack.map((tech: string) => (
          <TechTag key={tech} tech={tech} />
        ))}
      </p>
    </div>
  </div>
);

const AchievementsList = ({ achievements }: { achievements: string[] }) => (
  <ul className="space-y-1">
    {achievements.map((achievement, index) => (
      <AchievementItem key={index} achievement={achievement} />
    ))}
  </ul>
);

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(0);
  const project = PROJECTS[selectedProject];

  return (
    <AboutLayout>
      <Timeline
        setSelectedProject={setSelectedProject}
        selectedProject={selectedProject}
      />
      <ProjectHeader project={project} />
      <ProjectInfo project={project} />
      <div className="relative w-[400px] h-[200px]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <AchievementsList achievements={project.achievements} />
    </AboutLayout>
  );
}
