import fs from "fs";
import path from "path";

import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

export type ProjectMeta = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  icon: string;
  image: string[];
  links?: {
    github?: string;
    demo?: string;
    appStore?: string;
  };
};

const PROJECTS: ProjectMeta[] = [
  {
    id: "1",
    title: "기룡아 밥먹자",
    description: "대학 식당 식단 정보를 제공하는 웹사이트",
    status: "completed",
    icon: "/icons/icon-kiryong.webp",
    image: [
      "/images/kiryong-thumbnail.webp",
      "/images/kiryong-mobile-new.webp",
    ],
    links: {
      github: "https://github.com/Kyonggi-Univ-Diet-Information/FE",
      demo: "https://www.kiryong.kr/ko",
    },
  },
  {
    id: "2",
    title: "TeamPu",
    description: "컴퓨터공학부 팀프로젝트실 예약 및 관리 시스템",
    status: "completed",
    icon: "/icons/icon-teampu.webp",
    image: ["/images/teampu-thumb.webp"],
    links: { github: "https://github.com/Gobongbab/TeamPu-Web" },
  },
  {
    id: "3",
    title: "Soup",
    description: "대학생 팀 프로젝트를 위한 협업 및 관리 도구",
    status: "completed",
    icon: "/icons/icon-soup.webp",
    image: ["/images/soup-thumb.webp"],
    links: { github: "https://github.com/Team-Soup-Soup/Soup-FE" },
  },
  {
    id: "4",
    title: "FestaMate",
    description: "대학 축제에서 함께할 친구를 찾는 매칭 서비스",
    status: "completed",
    icon: "/icons/icon-festamate.webp",
    image: ["/images/festamate-thumb.webp"],
    links: {
      github: "https://github.com/Gobongbab/Festamate-Web",
      demo: "https://festamate-web.vercel.app/",
    },
  },
  {
    id: "5",
    title: "Took!",
    description: "간편하고 안전한 온라인 투표 시스템",
    status: "completed",
    icon: "/icons/icon-took.webp",
    image: ["/images/took-poster.webp"],
    links: { github: "https://github.com/KGU-Vote-System/Client" },
  },
  {
    id: "6",
    title: "쉼표",
    description: "사용자의 디지털 피로도를 기반으로 한 힐링 여행 추천 서비스",
    status: "completed",
    icon: "/icons/icon-shwimpyo.webp",
    image: ["/images/shwimpyo-poster.webp", "/images/shwimpyo-1.webp"],
    links: { appStore: "https://m.onestore.co.kr/v2/ko-kr/app/0001002397" },
  },
  {
    id: "7",
    title: "리빙메이트",
    description: "같이 살 룸메이트를 구하는 서비스",
    status: "completed",
    icon: "/icons/icon-livingmate.webp",
    image: ["/images/livingmate-thumb.webp"],
    links: {
      github: "https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_73_FE",
    },
  },
  {
    id: "8",
    title: "Piggo",
    description: "Khuthon 2025 참가 프로젝트 - 돼지 기침 감지 축사 관리 시스템",
    status: "completed",
    icon: "/icons/icon-piggo.webp",
    image: ["/images/piggo-thumb.webp", "/images/piggo-1.webp"],
    links: { github: "https://github.com/ByteCrew-Khuthon/frontend" },
  },
  {
    id: "9",
    title: "농기구 온",
    description:
      "us:code in 의성 2025 참가 프로젝트 - 농기구 대여 서비스 개선 프로젝트",
    status: "completed",
    icon: "/icons/icon-ng.webp",
    image: ["/images/ng-thumb.webp", "/images/ng-1.webp"],
    links: { github: "https://github.com/ByteCrew-Uscode/Web" },
  },
];

type ProjectFrontmatter = {
  period?: string;
  role?: string;
  stack?: string[];
};

function readMarkdown(id: string) {
  const file = path.join(PROJECTS_DIR, `${id}.md`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data: data as ProjectFrontmatter, content };
}

function parsePeriodStart(period?: string) {
  if (!period) return 0;
  const start = period.split(/[~-]/)[0]?.trim().replace(/\./g, "-");
  return new Date(start).getTime() || 0;
}

const PINNED_FIRST_ID = "1";

export function getAllProjects() {
  return PROJECTS.map((project) => {
    const { data } = readMarkdown(project.id);
    return { ...project, ...data };
  }).sort((a, b) => {
    if (a.id === PINNED_FIRST_ID) return -1;
    if (b.id === PINNED_FIRST_ID) return 1;
    return parsePeriodStart(b.period) - parsePeriodStart(a.period);
  });
}

export function getAllProjectIds() {
  return PROJECTS.map((p) => p.id);
}

export function getProjectById(id: string) {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) return null;
  const { data, content } = readMarkdown(id);
  return { ...project, ...data, content };
}
