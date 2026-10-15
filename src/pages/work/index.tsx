import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import { getAllExperiences, type ExperienceMeta } from "@/lib/experiences";
import { getAllProjects } from "@/lib/projects";

function ExperienceLink({ experience }: { experience: ExperienceMeta }) {
  return (
    <Link
      href={`/work/experiences/${experience.slug}`}
      className="group flex flex-col gap-0.5"
    >
      <span className="text-caption text-muted">{experience.period}</span>
      <span className="text-body text-foreground group-hover:text-link font-medium break-keep transition-colors">
        {experience.title}
        <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
          ›
        </span>
      </span>
    </Link>
  );
}

function groupByYear(experiences: ExperienceMeta[]) {
  const groups = new Map<string, typeof experiences>();
  for (const experience of experiences) {
    const year = experience.period.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), experience]);
  }
  return [...groups].sort(([a], [b]) => b.localeCompare(a));
}

export const getStaticProps = async () => {
  return {
    props: { experiences: getAllExperiences(), projects: getAllProjects() },
  };
};

export default function WorkPage({
  experiences,
  projects,
}: {
  experiences: ReturnType<typeof getAllExperiences>;
  projects: ReturnType<typeof getAllProjects>;
}) {
  return (
    <>
      <Head>
        <title>Work</title>
        <meta name="description" content="지금까지의 경험과 참여한 프로젝트" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-16 pt-12 pb-20">
        <PageHeader
          title="Work"
          description="지금까지 해온 일과 만든 것들이에요."
        />

        <section className="flex flex-col gap-6">
          <h2 className="text-tile-heading">경험</h2>
          <ol
            className="hidden grid-rows-[auto_1px_auto] gap-x-4 md:grid"
            style={{
              gridTemplateColumns: `repeat(${experiences.length + 1}, minmax(0, 1fr))`,
            }}
          >
            <li aria-hidden className="bg-border col-span-full row-start-2" />
            {[...experiences].reverse().map((experience, index) => {
              const isAbove = index % 2 === 0;
              return (
                <li
                  key={experience.slug}
                  className={cn(
                    "border-border relative col-span-2 border-l pl-4",
                    isAbove ? "row-start-1 self-end pb-6" : "row-start-3 pt-6",
                  )}
                  style={{ gridColumnStart: index + 1 }}
                >
                  <span
                    className={cn(
                      "bg-primary absolute -left-[5.5px] h-2.5 w-2.5 rounded-full",
                      isAbove ? "-bottom-[5.5px]" : "-top-[5.5px]",
                    )}
                  />
                  <ExperienceLink experience={experience} />
                </li>
              );
            })}
          </ol>

          <ol className="flex flex-col gap-10 md:hidden">
            {groupByYear(experiences).map(([year, items]) => (
              <li key={year} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="text-tile-heading">{year}</span>
                  <span className="bg-border h-px flex-1" />
                </div>
                <ul className="flex flex-col gap-4">
                  {items.map((experience) => (
                    <li key={experience.slug}>
                      <ExperienceLink experience={experience} />
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-tile-heading">프로젝트</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="card-rise"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="flex h-full flex-col transition-opacity hover:opacity-80">
                  <Card.Image>
                    <Image
                      src={project.image[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </Card.Image>
                  <Card.Content className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Image
                        src={project.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-[4px]"
                      />
                      <Card.Title>{project.title}</Card.Title>
                    </div>
                    <Card.Description>{project.description}</Card.Description>
                  </Card.Content>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
