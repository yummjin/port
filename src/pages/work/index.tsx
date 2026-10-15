import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { getAllProjects } from "@/lib/projects";

const TIMELINE = [
  { period: "2026.05", title: "당근 프론트엔드 인턴" },
  { period: "2025.10 – 2026.02", title: "CMC Web 팀원" },
  { period: "2025.06", title: "us:code in 의성 해커톤 최우수상" },
  { period: "2025.05", title: "Khuthon 우수상" },
  {
    period: "2025.03 – 2025.08",
    title: "구름톤 유니브 경기대학교 프론트엔드 활동",
  },
  { period: "2023 – 2027", title: "경기대학교 컴퓨터공학전공" },
];

export const getStaticProps = async () => {
  return { props: { projects: getAllProjects() } };
};

export default function WorkPage({
  projects,
}: {
  projects: ReturnType<typeof getAllProjects>;
}) {
  return (
    <>
      <Head>
        <title>Work</title>
        <meta name="description" content="지금까지의 경험과 참여한 프로젝트" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-16 pt-16 pb-20">
        <PageHeader
          title="Work"
          description="지금까지 해온 일과 만든 것들이에요."
        />

        <section className="flex flex-col gap-6">
          <h2 className="text-tile-heading">경험</h2>
          <ol className="border-border flex flex-col gap-8 border-l pl-6">
            {TIMELINE.map((item) => (
              <li key={item.title} className="relative">
                <span className="bg-primary absolute top-1 -left-[29px] h-2.5 w-2.5 rounded-full" />
                <p className="text-caption text-muted">{item.period}</p>
                <h3 className="text-body font-medium">{item.title}</h3>
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
