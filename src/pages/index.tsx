import Layout from "@/components/Layout";
import { PROJECTS, SKILLS } from "@/shared/data";
import Title from "@/shared/components/Title";
import Head from "next/head";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>한유진 - Frontend Developer</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <section className="flex min-h-[calc(100vh-100px)] w-full flex-col justify-center gap-4 pb-20 md:gap-6">
          <div className="bg-card-background border-text-muted w-fit rounded-full px-4 py-2">
            안녕하세요! 👋
          </div>
          <Title
            size="2xl"
            as="h1"
            subTitle={
              <>
                디자인과 성능, 그리고 사용자 경험을 통해 <br />
                어떻게 사용자와 더 가까워질 수 있을지 고민하는 것을 즐깁니다.
              </>
            }
            className="max-w-2xl"
          >
            프론트엔드 개발자
            <br />
            한유진입니다
          </Title>
        </section>

        <section
          id="skills"
          className="flex min-h-screen flex-col justify-center"
        >
          <Title size="lg" as="h2" className="mb-8 w-full text-center">
            이런 기술들을 주로 사용해요!
          </Title>
          <div className="relative overflow-hidden">
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent" />
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent" />
            <motion.div
              className="flex gap-4 pr-4"
              initial={{ x: 0 }}
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
            >
              {[...SKILLS, ...SKILLS].map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`}
                  className="bg-card-background border-border flex w-[260px] shrink-0 rounded-xl border p-4"
                >
                  <div className="flex flex-col items-start gap-2">
                    <div className="bg-border relative grid size-10 place-items-center overflow-hidden rounded-full">
                      <Image
                        src={skill.image}
                        alt={skill.name}
                        width={42}
                        height={42}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-foreground truncate text-base font-semibold">
                        {skill.name}
                      </h3>
                      <p className="text-text-muted text-sm">
                        숙련도 {skill.proficiency} / 5
                      </p>
                      {/* <div className="mt-2 space-y-2">{skill.description}</div> */}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          id="projects"
          className="mb-20 flex min-h-[calc(100vh-100px)] w-full scroll-mt-24 flex-col justify-center gap-12 md:flex-row"
        >
          <Title size="lg" as="h2" className="text-nowrap">
            최근에는 <br />
            이런 프로젝트를
            <br className="block md:hidden" /> 진행했어요!
          </Title>
          <div className="flex w-full flex-col gap-4">
            {PROJECTS.slice(0, 4).map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group"
              >
                <div className="bg-card-background border-border hover:border-accent w-full overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg">
                  <div className="p-4">
                    <h3 className="text-foreground group-hover:text-accent mb-2 flex items-center gap-2 font-semibold transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-muted line-clamp-2 text-sm">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {/* 더 보기 버튼 */}
            <Link href="/projects" className="group">
              <div className="bg-card-background border-border hover:border-accent w-full overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg">
                <div className="flex min-h-[80px] items-center justify-center p-4">
                  <div className="text-text-muted group-hover:text-accent flex items-center gap-3 transition-colors">
                    <span className="text-sm font-medium">
                      모든 프로젝트 보기
                    </span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
