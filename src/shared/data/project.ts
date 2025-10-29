export type ProjectBase = {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress";
  thumb?: string;
  image?: string[];
};

const PROJECTS_DATA: ProjectBase[] = [
  {
    id: "1",
    title: "기룡아 밥먹자",
    description: "대학 식당 식단 정보를 제공하는 웹사이트",
    status: "completed",
    thumb: "/kiryong-thumbnail.png",
    image: [
      "/kiryong-thumbnail.png",
      "/kiryong-page.png",
      "/kiryong-mobile.png",
    ],
  },
  {
    id: "2",
    title: "TeamPu",
    description: "컴퓨터공학부 팀프로젝트실 예약 및 관리 시스템",
    status: "completed",
    thumb: "/images/teampu-thumb.png",
    image: ["/images/teampu-thumb.png"],
  },
  {
    id: "3",
    title: "Soup",
    description: "대학생 팀 프로젝트를 위한 협업 및 관리 도구",
    status: "completed",
    thumb: "/images/soup-thumb.png",
    image: ["/images/soup-thumb.png"],
  },
  {
    id: "4",
    title: "FestaMate",
    description: "대학 축제에서 함께할 친구를 찾는 매칭 서비스",
    status: "completed",
    thumb: "/images/festamate-thumb.png",
    image: ["/images/festamate-thumb.png"],
  },
  {
    id: "8",
    title: "Piggo",
    description: `Khuthon 2025 참가 프로젝트 - 돼지 기침 감지 축사 관리 시스템`,
    status: "completed",
    thumb: "/images/piggo-thumb.png",
    image: [
      "/images/piggo-thumb.png",
      "/images/piggo-1.png",
      "/images/piggo-2.png",
      "/images/piggo-3.png",
      "/images/piggo-4.png",
      "/images/piggo-5.png",
    ],
  },
  {
    id: "9",
    title: "농기구 온",
    description: `us:code in 의성 2025 참가 프로젝트 - 농기구 대여 서비스 개선 프로젝트`,
    status: "completed",
    thumb: "/images/ng-thumb.png",
    image: [
      "/images/ng-thumb.png",
      "/images/ng-6.png",
      "/images/ng-7.png",
      "/images/ng-8.png",
      "/images/ng-9.png",
      "/images/ng-10.png",
      "/images/ng-11.png",
      "/images/ng-1.png",
      "/images/ng-2.png",
      "/images/ng-3.png",
      "/images/ng-4.png",
      "/images/ng-5.png",
    ],
  },
  {
    id: "5",
    title: "Took!",
    description: "간편하고 안전한 온라인 투표 시스템",
    status: "completed",
    thumb: "/images/took-poster.png",
    image: ["/images/took-poster.png"],
  },
  {
    id: "6",
    title: "쉼표",
    description: `사용자의 디지털 피로도를 기반으로 한 힐링 여행 추천 서비스`,
    status: "completed",
    thumb: "/images/shwimpyo-poster.png",
    image: [
      "/images/shwimpyo-poster.png",
      "/images/shwimpyo-1.png",
      "/images/shwimpyo-2.png",
      "/images/shwimpyo-3.png",
      "/images/shwimpyo-4.png",
      "/images/shwimpyo-5.png",
    ],
  },
  {
    id: "7",
    title: "리빙메이트",
    description: `같이 살 룸메이트를 구하는 서비스`,
    status: "completed",
    thumb: "/images/livingmate-thumb.png",
    image: ["/images/livingmate-thumb.png"],
  },
];

export const PROJECTS = PROJECTS_DATA;
