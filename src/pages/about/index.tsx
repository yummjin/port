import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Title } from "@/shared/components";
import { PostLayout, RootLayout } from "@/shared/layouts";
import { cn } from "@/shared/utils";

export default function AboutPage() {
  return (
    <RootLayout>
      <Head>
        <title>소개</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <PostLayout
        title="안녕하세요!"
        description="프론트엔드 개발자 한유진입니다."
      >
        <div className="flex gap-4">
          <Link
            className="text-foreground hover:text-subLight underline underline-offset-4"
            href="https://github.com/yummjin"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            className="text-foreground hover:text-subLight underline underline-offset-4"
            href="https://velog.io/@yummjin/posts"
            target="_blank"
          >
            Velog
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          <Image
            src="/images/profile.jpeg"
            alt="profile"
            width={300}
            height={400}
          />
          <Image
            src="/images/profile2.jpeg"
            alt="profile"
            width={300}
            height={400}
          />
          <div className="flex flex-col gap-4">
            <Image
              src="/images/experience1.jpeg"
              alt="profile"
              width={150}
              height={200}
            />
            <Image
              src="/images/experience2.jpeg"
              alt="profile"
              width={150}
              height={200}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/images/experience3.jpeg"
              alt="profile"
              width={150}
              height={200}
            />
            <Image
              src="/images/experience4.jpeg"
              alt="profile"
              width={150}
              height={200}
            />
          </div>
        </div>
        <Title size="md" as="h2">
          About Me
        </Title>
        <p className="leading-loose">
          목표를 끝까지 완성하려는 몰입력으로 서비스 품질과 개발자 경험을 함께
          개선해 왔습니다.
          <br />
          코드를 통해 사용자 경험을 높이는 플로우를 제공하는 것에 관심이
          많습니다.
          <br />
          현재에 안주하지 않고 항상 더 나은 구조를 위해 생각하는 것을
          좋아합니다.
        </p>
        <Title size="md" as="h2">
          Education
        </Title>
        <p className="leading-loose">
          경기대학교 컴퓨터공학전공 (2023.03 ~ 2027.02)
        </p>
        <Title size="md" as="h2">
          Experience
        </Title>
        <ExperienceSection groups={EXPERIENCE_GROUPS} />
      </PostLayout>
    </RootLayout>
  );
}

type ExperienceItem = { category: string; title: string };
type ExperienceGroup = ExperienceItem[];

const EXPERIENCE_GROUPS: ExperienceGroup[] = [
  [
    { category: "동아리 활동", title: "교내 개발동아리 InQ" },
    { category: "사이드 프로젝트", title: "기룡아 밥먹자" },
    { category: "사이드 프로젝트", title: "팀프로젝트실 예약 시스템" },
    { category: "사이드 프로젝트", title: "FestaMate" },
  ],
  [{ category: "사이드 프로젝트", title: "Soup" }],
  [
    { category: "동아리 활동", title: "교내 개발동아리 C-Lab" },
    { category: "동아리 프로젝트", title: "C-Lab 멤버스 서비스" },
  ],
  [
    { category: "동아리 활동", title: "학과 사이트 개발팀 (CSHOME)" },
    { category: "동아리 프로젝트", title: "학과 사이트 (CSHOME)" },
  ],
  [
    { category: "동아리 활동", title: "구름톤 유니브 4기" },
    { category: "동아리 프로젝트", title: "전자투표 시스템 Took!" },
    { category: "해커톤", title: "구름톤 유니브 4기 시즌톤" },
    { category: "해커톤 출품", title: "리빙메이트" },
  ],
  [
    { category: "동아리 활동", title: "CMC 18기" },
    { category: "동아리 프로젝트", title: "AZIT" },
    { category: "해커톤", title: "CMC Ne(o)rdinary 2025" },
    { category: "해커톤 출품", title: "Agree? 정말 동의해?" },
  ],
  [
    { category: "해커톤", title: "2025 us:code 해커톤 in 의성" },
    {
      category: "해커톤 출품",
      title: "농기구온 (농기구 대여 접근성 개선 서비스)",
    },
  ],
  [
    { category: "해커톤", title: "KHUTHON 2025" },
    { category: "해커톤 출품", title: "돼지 기침 감지 시스템 Piggo" },
  ],
  [
    { category: "공모전", title: "2025 관광데이터 공모전" },
    { category: "공모전 출품", title: "쉼표" },
  ],
];

function ExperienceSection({ groups }: { groups: ExperienceGroup[] }) {
  return (
    <div className="space-y-6">
      {groups.map((items, groupIndex) => (
        <ExperienceTimeline key={groupIndex} items={items} />
      ))}
    </div>
  );
}

function ExperienceTimeline({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <p className="text-foreground font-medium">{item.title}</p>
          <span
            className={cn(
              "text-subLight text-xs font-medium underline underline-offset-4",
              item.category === "동아리 활동" && "text-status-success-text",
              item.category === "사이드 프로젝트" && "text-white/80",
              item.category === "동아리 프로젝트" && "text-status-success-text",
              item.category === "해커톤" && "text-status-progress-text",
              item.category === "해커톤 출품" && "text-status-progress-text",
              item.category === "공모전" && "text-subLight",
              item.category === "공모전 출품" && "text-subLight",
            )}
          >
            {item.category}
          </span>
        </div>
      ))}
    </div>
  );
}
