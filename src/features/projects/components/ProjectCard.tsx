import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/shared/components";

import type { ProjectListItem } from "@/pages/projects";

export const ProjectCard = ({
  project,
  index = 0,
}: {
  project: ProjectListItem;
  index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: index * 0.06,
    }}
  >
    <Link href={`/projects/${project.id}`} className="flex flex-col gap-4">
      <Card>
        <Image
          src={project.thumb || ""}
          alt={project.title}
          width={500}
          height={500}
          className="h-full w-full object-cover"
        />
      </Card>
      <div className="flex items-start gap-3">
        <div className="size-9 overflow-hidden rounded-full">
          <Image
            src={project.icon}
            alt={project.title}
            width={36}
            height={36}
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col gap-2 leading-none font-semibold">
          <p className="line-clamp-1">{project.title}</p>
          <p className="text-text-muted line-clamp-1 text-sm leading-none font-normal">
            {project.description}
          </p>
          <p className="text-text-muted line-clamp-1 text-xs leading-none font-normal">
            {project.mdPeriod}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);
