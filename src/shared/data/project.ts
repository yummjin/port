// 프로젝트 기간을 파싱하여 정렬용 날짜를 반환하는 함수
const parseProjectDate = (period: string): Date => {
  // "2024.10.20 ~ 2024.11.20" 형식에서 시작 날짜 추출
  const startDate = period.split(" ~ ")[0];

  // "2024.10.20" 형식을 "2024-10-20" 형식으로 변환
  const normalizedDate = startDate.replace(/\./g, "-");

  return new Date(normalizedDate);
};

// 프로젝트 데이터
const PROJECTS_DATA = [
  {
    id: "1",
    title: "기룡아 밥먹자",
    description: "대학 식당 식단 정보를 제공하는 웹사이트",
    period: "2024.10.20 ~ 2024.11.20",
    image: [
      "/kiryong-thumbnail.png",
      "/kiryong-page.png",
      "/kiryong-mobile.png",
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "PWA"],
    role: "Frontend Developer",
    teamSize: "3명",
    myContribution: "프론트엔드 개발 및 UI/UX 디자인",
    achievements: [
      "PWA 지원으로 사용 편의성 향상",
      "카카오 로그인 기능 첫 구현",
      "게시판 CRUD 기능 첫 구현",
      "식단 정보 API 연동",
      "에브리타임에서의 긍정적인 피드백",
    ],
    links: {
      github: "https://github.com/Kyonggi-Univ-Diet-Information/FE",
      demo: "https://kiryong.kr/",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png",
  },
  {
    id: "2",
    title: "TeamPu",
    description: "컴퓨터공학부 팀프로젝트실 예약 및 관리 시스템",
    period: "2024. 11. 21 ~ 2024. 12. 15",
    image: ["/images/teampu-thumb.png"],
    techStack: ["React", "JavaScript", "TailwindCSS"],
    role: "Full Stack Developer",
    teamSize: "5명",
    myContribution: "프론트엔드 개발 및 UI/UX 디자인",
    achievements: ["React Calendar 커스텀을 통한 날짜 별 예약 인원 표시"],
    links: {
      github: "https://github.com/Gobongbab/Teampu-Web",
      demo: "https://team-pu.vercel.app",
    },
    status: "completed",
    thumb: "/images/teampu-thumb.png",
  },
  {
    id: "3",
    title: "Soup",
    description: "대학생 팀 프로젝트를 위한 협업 및 관리 도구",
    period: "2025. 03. 20 ~ 2025. 08. 20",
    image: ["/images/soup-thumb.png"],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    role: "Frontend Developer",
    teamSize: "6명",
    myContribution: "프로젝트 대시보드 및 칸반보드 구현",
    achievements: [
      "실시간 협업 기능 구현",
      "프로젝트 진행률 시각화",
      "사용자 피드백 4.3/5점",
    ],
    links: {
      github: "https://github.com/Team-Soup-Soup/Soup-FE",
      demo: "http://student-p.p-e.kr/",
    },
    status: "completed",
    thumb: "/images/soup-thumb.png",
  },
  {
    id: "4",
    title: "FestaMate",
    description: "대학 축제에서 함께할 친구를 찾는 매칭 서비스",
    period: "2025. 03. 09 ~ 2025. 05. 17",
    image: ["/images/festamate-thumb.png"],
    techStack: ["React", "TypeScript", "StackFlow"],
    role: "Frontend Lead",
    teamSize: "4명",
    myContribution: "프론트엔드 개발",
    achievements: [
      "축제 기간 중 300명 매칭 성공",
      "사용자 만족도 4.5/5점",
      "대학 언론에 소개",
    ],
    links: {
      github: "https://github.com/Gobongbab/Festamate-Web",
      demo: "https://festamate-web.vercel.app/",
    },
    status: "completed",
    thumb: "/images/festamate-thumb.png",
  },
  {
    id: "5",
    title: "Took!",
    description: "간편하고 안전한 온라인 투표 시스템",
    period: "2025. 05. 21 ~ 2025. 07. 18",
    image: ["/images/took-poster.png"],
    techStack: ["React", "TypeScript", "StackFlow"],
    role: "Full Stack Developer",
    teamSize: "6명",
    myContribution: "프론트엔드 개발",
    achievements: ["실시간 투표 결과 시각화", "투표 보안 시스템 구축"],
    links: {
      github: "https://github.com/KGU-Vote-System/Client",
      demo: "https://took-five.vercel.app/",
    },
    status: "completed",
    thumb: "/images/took-poster.png",
  },
  {
    id: "6",
    title: "쉼표",
    description: `사용자의 디지털 피로도를 기반으로 한 힐링 여행 추천 서비스`,
    period: "2025. 08. 16 ~ 2025. 09. 18",
    image: [
      "/images/shwimpyo-poster.png",
      "/images/shwimpyo-1.png",
      "/images/shwimpyo-2.png",
      "/images/shwimpyo-3.png",
      "/images/shwimpyo-4.png",
      "/images/shwimpyo-5.png",
    ],
    techStack: ["React Native", "TypeScript", "Tanstack Query", "Zustand"],
    role: "Frontend Developer",
    teamSize: "4명",
    myContribution: "프론트엔드 개발",
    achievements: ["원스토어 배포 성공"],
    links: {
      github: "https://github.com/DDOX-2025/FE",
      appStore: "https://m.onestore.co.kr/v2/ko-kr/app/0001002397",
    },
    status: "done",
    thumb: "/images/shwimpyo-poster.png",
  },
  {
    id: "7",
    title: "리빙메이트",
    description: `같이 살 룸메이트를 구하는 서비스`,
    period: "2025. 08. 30 ~ 2025. 09. 18",
    image: ["/images/livingmate-thumb.png"],
    techStack: ["React Native", "TypeScript", "Tanstack Query", "Zustand"],
    role: "Frontend Developer",
    teamSize: "6명",
    myContribution: "프론트엔드 개발",
    achievements: [
      "구름톤 유니브 2025 시즌톤 본선 진출",
      "복잡한 폼을 React-Hook-Form 리액트 네이티브를 사용해 구현",
    ],
    links: {
      github: "https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_73_FE",
    },
    status: "done",
    thumb: "/images/livingmate-thumb.png",
  },
  // {
  //   id: "7",
  //   title: "Clab-Time : 동아리 시간 관리 시스템",
  //   description: "동아리 활동 시간 기록 및 관리 시스템",
  //   period: "2024. 07. 17 ~ 2024. 07. 26(예정)",
  //   image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
  //   techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  //   role: "Backend Developer",
  //   teamSize: "4명",
  //   myContribution: "백엔드 API 개발 및 데이터베이스 설계",
  //   achievements: [
  //     "시간 기록 자동화 시스템 구축",
  //     "데이터 분석 대시보드 개발 예정",
  //   ],
  //   links: {
  //     github: "https://github.com/yummjin/clab-time",
  //   },
  //   status: "in_progress",
  //   thumb: "/kiryong-thumbnail.png"

  // },
];

// 프로젝트를 시작 날짜 기준으로 내림차순 정렬 (최신순)
export const PROJECTS = PROJECTS_DATA.sort((a, b) => {
  const dateA = parseProjectDate(a.period);
  const dateB = parseProjectDate(b.period);
  return dateB.getTime() - dateA.getTime();
});
