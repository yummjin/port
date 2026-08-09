import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";

const SKILLS = [
  {
    name: "TypeScript",
    description:
      "any 타입의 사용을 지양하고, 제네릭 타입을 통해 최대한 타입 안정성을 높이는 것을 목표로 개발하고 있습니다.",
    image: "/images/skills-typescript.png",
  },
  {
    name: "JavaScript",
    description: "자바스크립트의 내부 동작 원리까지 공부하며 이해하고 있습니다.",
    image: "/images/skills-javascript.png",
  },
  {
    name: "Next.js",
    description:
      "App 라우터를 통해 실제 사용하던 서비스의 성능을 개선한 경험이 있습니다. 서버 컴포넌트의 이점을 최대한 살려 개발합니다.",
    image: "/images/skills-nextjs.png",
  },
  {
    name: "React",
    description: "리액트의 선언형 프로그램 패러다임에 익숙합니다.",
    image: "/images/skills-react.png",
  },
];

const TIMELINE = [
  { period: "2026.05", title: "당근 프론트엔드 인턴" },
  { period: "2025.10 – 2026.02", title: "CMC Web 팀원" },
  { period: "2025.06", title: "us:code in 의성 해커톤 최우수상" },
  { period: "2025.05", title: "Khuthon 우수상" },
  { period: "2025.03 – 2025.08", title: "구름톤 유니브 경기대학교 프론트엔드 활동" },
  { period: "2023 – 2027", title: "경기대학교 컴퓨터공학전공" },
];

export default function AboutPage() {
  const [selected, setSelected] = useState(SKILLS[0].name);
  const selectedSkill = SKILLS.find((skill) => skill.name === selected)!;

  return (
    <>
      <Head>
        <title>소개</title>
        <meta
          name="description"
          content="디자인과 성능, 그리고 사용자 경험을 통해 어떻게 사용자와 더 가까워질 수 있을지 고민하는 프론트엔드 개발자 한유진입니다."
        />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-16 pt-16 pb-20">
        <section className="flex flex-col gap-4">
          <p className="text-body text-muted">About</p>
          <h1 className="text-display-hero">한유진</h1>
          <p className="text-body text-secondary max-w-[560px]">
            디자인과 성능, 그리고 사용자 경험을 통해 어떻게 사용자와 더
            가까워질 수 있을지 고민하는 것을 즐깁니다. 프론트엔드 개발자를
            꿈꾸고 있습니다.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-tile-heading">기술 스택</h2>

          <div className="border-border bg-border grid grid-cols-2 gap-px overflow-hidden rounded-docs-card border sm:grid-cols-4">
            {SKILLS.map((skill) => {
              const isSelected = skill.name === selected;
              return (
                <button
                  key={skill.name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(skill.name)}
                  className={cn(
                    "bg-surface flex flex-col items-center gap-3 px-4 py-6 transition-colors",
                    isSelected
                      ? "bg-canvas border-b-primary border-b-2"
                      : "hover:bg-canvas border-b-2 border-b-transparent",
                  )}
                >
                  <Image
                    src={skill.image}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-[6px]"
                  />
                  <span
                    className={cn(
                      "text-body-small",
                      isSelected
                        ? "text-foreground font-medium"
                        : "text-secondary",
                    )}
                  >
                    {skill.name}
                  </span>
                </button>
              );
            })}
          </div>

          <Card className="p-4">
            <p
              key={selectedSkill.name}
              className="text-body-small text-secondary fade-in"
            >
              {selectedSkill.description}
            </p>
          </Card>
        </section>

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
      </main>
    </>
  );
}
