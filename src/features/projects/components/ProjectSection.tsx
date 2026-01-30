import { CardWrapper } from "@/shared/components";

import { ProjectCard } from "./ProjectCard";

import { ProjectListItem } from "@/pages/projects";

export default function ProjectSection({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  return (
    <CardWrapper>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </CardWrapper>
  );
}
