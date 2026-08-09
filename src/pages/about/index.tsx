import Head from "next/head";
import Image from "next/image";

import { Card } from "@/components/Card";

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

export default function AboutPage() {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SKILLS.map((skill) => (
              <Card key={skill.name} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={skill.image}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded-[4px]"
                  />
                  <h3 className="text-body font-medium">{skill.name}</h3>
                </div>
                <p className="text-body-small text-secondary">
                  {skill.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
