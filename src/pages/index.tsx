import { DESCRIPTION, PROJECTS, SKILLS, HACKATHONS } from "@/shared/data";
import { cn } from "@/shared/utils";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"who" | "what" | "etc">("who");

  const renderTabContent = () => {
    if (activeTab === "who") {
      return (
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold md:text-2xl">{DESCRIPTION.name}</h1>
          <p className="hover:text-subLight cursor-pointer font-mono">
            {DESCRIPTION.email}
          </p>
          <p className="mt-1 leading-relaxed">{DESCRIPTION.description}</p>
        </div>
      );
    } else if (activeTab === "what") {
      return (
        <div className="flex w-full flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold md:text-2xl">주요 기술 스택</h1>
            <p>
              아래 기술 스택을 바탕으로 다양한 기술을 활용해 프로젝트를
              진행합니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {SKILLS.map((skill) => (
              <div key={skill.name} className="border-subDark/50 border-b pb-2">
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === "etc") {
      return (
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold md:text-2xl">기타</h1>
          <p className="hover:text-subLight cursor-pointer font-mono">
            et cetera...
          </p>
          <p className="mt-1 leading-relaxed">
            저는 수족냉증이 있어서 개발할 때 손이 시렵습니다.. ㅜㅜ
          </p>
        </div>
      );
    }
  };

  return (
    <>
      <Head>
        <title>한유진</title>
        <meta name="description" content="프론트엔드 개발자 한유진입니다" />
      </Head>
      <section className="flex flex-col gap-4 md:flex-row">
        <div className="bg-subWhite text-subDark relative flex h-100 w-full justify-between gap-4 rounded-4xl p-10 pt-18">
          <div className="text-subDark bg-background absolute top-0 left-0 flex h-10 w-[84%] max-w-[730px] gap-1 rounded-br-4xl">
            <TabButton
              label="who am i?"
              onClick={() => setActiveTab("who")}
              active={activeTab === "who"}
            />

            <TabButton
              label="what i do?"
              onClick={() => setActiveTab("what")}
              active={activeTab === "what"}
            />
            <TabButton
              label="etc"
              onClick={() => setActiveTab("etc")}
              active={activeTab === "etc"}
            />
          </div>
          {renderTabContent()}
        </div>
        <div className="bg-subDark text-subWhite hidden h-100 w-[40%] gap-4 rounded-4xl px-8 py-10 md:flex md:flex-col">
          <Card number={PROJECTS.length} title="총 프로젝트" />
          <Card number={SKILLS.length} title="기술 스택" />
          <Card number={HACKATHONS.length} title="해커톤" />
          <Card number={2025} title="활동년도" />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-3 place-items-center gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11">
        {PROJECTS.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            className="flex flex-col gap-1"
            key={project.id}
          >
            <div className="relative col-span-1 size-20 cursor-pointer transition-transform hover:scale-105">
              <div className="bg-subLight absolute top-0 left-0 z-20 h-2 w-[60%] rounded-tl-4xl rounded-tr-4xl" />
              <div className="bg-subLight absolute top-2 right-0 z-20 h-4 w-[100%] rounded-tr-xl" />
              <div className="bg-background absolute top-0 right-0 z-10 h-6 w-full" />
              <div className="bg-subLight/60 relative h-18 w-20 rounded-2xl" />
            </div>
            <p className="text-center text-sm">{project.title}</p>
          </Link>
        ))}
      </section>
    </>
  );
}

function Card({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl transition-all">
      <div className="text-sm opacity-70">{title}</div>
      <div className="font-bold">{number}</div>
    </div>
  );
}

function TabButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      className={cn(
        "bg-subLight grid h-full w-[28%] max-w-[200px] cursor-pointer place-items-center rounded-t-4xl",
        active && "bg-subWhite",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
