import Card from "@/shared/components/Card";
import { SKILLS } from "@/shared/data";
import { AboutLayout } from "@/shared/layouts";
import Image from "next/image";
import React from "react";

export default function skills() {
  return (
    <AboutLayout>
      <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILLS.map((skill) => (
          <Card key={skill.name}>
            <Card.Header>
              <h1 className="font-mono font-semibold">{skill.name}</h1>
              <div className="size-6.5 relative">
                <Image
                  src={skill.image}
                  alt={skill.name}
                  fill
                  className="grayscale object-cover absolute inset-0"
                />
              </div>
            </Card.Header>
            <Card.Content>
              <div className="text-sm flex items-center gap-2">
                숙련도 <Proficiency proficiency={skill.proficiency} />
              </div>
              <div className="text-sm flex items-center gap-2">
                프로젝트 수{" "}
                <span className="text-main">{skill.projectNumber}</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                관련 프로젝트{" "}
                <RelatedProjects projects={skill.relatedProjects} />
              </div>
              <p className="text-sm text-gray-600">{skill.description}</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </AboutLayout>
  );
}

function Proficiency({ proficiency }: { proficiency: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: proficiency }).map((_, index) => (
        <div key={index} className="size-2 bg-main rounded-full" />
      ))}
      {Array.from({ length: 5 - proficiency }).map((_, index) => (
        <div key={index} className="size-2 bg-gray-200 rounded-full" />
      ))}
    </div>
  );
}

function RelatedProjects({ projects }: { projects: string[] }) {
  const MAX_DISPLAY_COUNT = 3;
  return (
    <div className="flex items-center gap-2">
      {projects.slice(0, MAX_DISPLAY_COUNT).map((project) => (
        <div
          key={project}
          className="text-xs px-1 py-0.5 bg-gray-100 text-gray-600"
        >
          {project}
        </div>
      ))}
      {projects.length > MAX_DISPLAY_COUNT && (
        <div className="text-xs px-1 py-0.5 bg-gray-100 text-gray-600">
          +{projects.length - MAX_DISPLAY_COUNT}
        </div>
      )}
    </div>
  );
}
