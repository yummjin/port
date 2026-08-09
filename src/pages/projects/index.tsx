import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { getAllProjects } from "@/lib/projects";

export const getStaticProps = async () => {
  return { props: { projects: getAllProjects() } };
};

export default function ProjectsPage({
  projects,
}: {
  projects: ReturnType<typeof getAllProjects>;
}) {
  return (
    <>
      <Head>
        <title>프로젝트</title>
        <meta name="description" content="개발에 참여한 모든 프로젝트" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-16 pb-20">
        <PageHeader
          title="프로젝트"
          description="다양한 사이드 프로젝트와 함께했어요."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
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
      </main>
    </>
  );
}
