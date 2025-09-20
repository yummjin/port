export const PROJECTS = [
  {
    id: "1",
    title: "기룡아 밥먹자 : 식단 안내 사이트",
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
      demo: "https://lets-eat-kiryong.vercel.app/",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png"
  },
  {
    id: "2",
    title: "TeamPu : 팀프실 예약 서비스",
    description: "대학 내 팀 프로젝트실 예약 및 관리 시스템",
    period: "2024. 11. 21 ~ 2024. 12. 15",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    techStack: ["React", "TypeScript", "Next.js", "Prisma", "PostgreSQL"],
    role: "Full Stack Developer",
    teamSize: "5명",
    myContribution: "풀스택 개발 및 예약 시스템 로직 구현",
    achievements: [
      "예약 충돌 방지 알고리즘 개발",
      "사용률 40% 증가",
      "관리자 업무 효율성 60% 향상",
    ],
    links: {
      github: "https://github.com/yummjin/teampu",
      demo: "https://teampu.vercel.app",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png"

  },
  {
    id: "3",
    title: "Soup : 대학생 프로젝트 관리 플랫폼",
    description: "대학생 팀 프로젝트를 위한 협업 및 관리 도구",
    period: "2024. 10. 20 ~ 2024. 11. 20",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
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
      github: "https://github.com/yummjin/soup",
      demo: "https://soup-platform.vercel.app",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png"

  },
  {
    id: "4",
    title: "FestaMate : 축제 친구 매칭 웹앱",
    description: "대학 축제에서 함께할 친구를 찾는 매칭 서비스",
    period: "2024. 03. 09 ~ 2024. 05. 17",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    techStack: ["React", "JavaScript", "Express.js", "MongoDB"],
    role: "Frontend Lead",
    teamSize: "4명",
    myContribution: "프론트엔드 개발 리드 및 매칭 알고리즘 UI 구현",
    achievements: [
      "축제 기간 중 300명 매칭 성공",
      "사용자 만족도 4.5/5점",
      "대학 언론에 소개",
    ],
    links: {
      github: "https://github.com/yummjin/festamate",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png"

  },
  {
    id: "5",
    title: "Took! : 전자투표 웹앱",
    description: "간편하고 안전한 온라인 투표 시스템",
    period: "2024. 06. 16 ~ 2024. 06. 27",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    techStack: ["React", "TypeScript", "Node.js", "Socket.io"],
    role: "Full Stack Developer",
    teamSize: "2명",
    myContribution: "풀스택 개발 및 실시간 투표 결과 구현",
    achievements: [
      "실시간 투표 결과 시각화",
      "투표 보안 시스템 구축",
      "해커톤 우수상 수상",
    ],
    links: {
      github: "https://github.com/yummjin/took",
    },
    status: "completed",
    thumb: "/kiryong-thumbnail.png"

  },
  {
    id: "6",
    title: "EmotionalCore : 감정 분석 AI 서비스",
    description: "텍스트 기반 감정 분석 및 상담 추천 AI 서비스",
    period: "2024. 07. 05 ~ 진행중",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    techStack: ["React", "TypeScript", "Python", "FastAPI", "OpenAI API"],
    role: "Frontend Developer",
    teamSize: "3명",
    myContribution: "프론트엔드 개발 및 AI 결과 시각화",
    achievements: [
      "AI 모델 정확도 85% 달성",
      "사용자 만족도 지속적 향상",
      "베타 테스트 진행 중",
    ],
    links: {
      github: "https://github.com/yummjin/emotional-core",
    },
    status: "in_progress",
    thumb: "/kiryong-thumbnail.png"

  },
  {
    id: "7",
    title: "Clab-Time : 동아리 시간 관리 시스템",
    description: "동아리 활동 시간 기록 및 관리 시스템",
    period: "2024. 07. 17 ~ 2024. 07. 26(예정)",
    image: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    role: "Backend Developer",
    teamSize: "4명",
    myContribution: "백엔드 API 개발 및 데이터베이스 설계",
    achievements: [
      "시간 기록 자동화 시스템 구축",
      "데이터 분석 대시보드 개발 예정",
    ],
    links: {
      github: "https://github.com/yummjin/clab-time",
    },
    status: "in_progress",
    thumb: "/kiryong-thumbnail.png"

  },
];
