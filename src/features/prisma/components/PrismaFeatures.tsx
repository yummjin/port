"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

import { Card } from "@/shared/components";

import { WordsPullUpMultiStyle } from "./animations";

const CARD_EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4";

interface FeatureCardData {
  number: string;
  title: string;
  iconSrc: string;
  items: string[];
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    number: "01",
    title: "프로젝트 설계.",
    iconSrc:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85",
    items: [
      "요구사항 분석 및 구조화",
      "협업 기반 일정 관리",
      "레퍼런스 및 디자인 정합",
      "버전 관리",
    ],
  },
  {
    number: "02",
    title: "코드 리뷰 문화.",
    iconSrc:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85",
    items: [
      "정적 분석 기반 코드 점검",
      "맥락을 담은 리뷰 코멘트",
      "외부 도구 연동",
    ],
  },
  {
    number: "03",
    title: "몰입 환경 구축.",
    iconSrc:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85",
    items: ["알림 최소화", "집중을 위한 루틴", "일정 동기화"],
  },
];

function FeatureCard({
  data,
  index,
}: {
  data: FeatureCardData;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: CARD_EASE }}
    >
      <Card className="flex h-full max-h-none min-h-[170px] flex-col gap-6 border-0 bg-[#212121] p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.iconSrc}
          alt=""
          className="size-10 rounded sm:size-12"
        />
        <h3 className="text-lg font-medium leading-[1.143] tracking-[0.007em] text-[#2997ff]">
          {data.title} <span className="text-gray-500">({data.number})</span>
        </h3>
        <ul className="flex flex-1 flex-col gap-2">
          {data.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-[1.286] tracking-[-0.016em] text-gray-400"
            >
              <FiCheck className="mt-0.5 shrink-0 text-[#2997ff]" size={16} />
              {item}
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="inline-flex w-fit items-center gap-1 text-sm tracking-[-0.016em] text-[#2997ff] hover:gap-2"
        >
          자세히 보기
          <FiArrowRight className="rotate-[-45deg]" size={14} />
        </a>
      </Card>
    </motion.div>
  );
}

function VideoCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: CARD_EASE }}
    >
      <Card className="h-auto max-h-none min-h-64 border-0 bg-[#212121] lg:h-full lg:min-h-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={FEATURES_VIDEO_SRC}
          className="absolute h-full w-full object-cover"
        />
        <div className="relative flex h-full min-h-64 items-end bg-gradient-to-t from-[#000000]/70 via-transparent p-6 lg:min-h-0">
          <p
            className="leading-[1.471] tracking-[-0.022em]"
            style={{ color: "#ffffff" }}
          >
            아이디어가 코드가 되는 순간.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export function PrismaFeatures() {
  return (
    <section className="relative min-h-screen bg-[#000000] px-4 py-24 md:px-6 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-6xl">
    <div className="mb-16 text-center text-xl font-semibold leading-[1.1] sm:text-2xl md:text-3xl lg:text-4xl">
      <WordsPullUpMultiStyle
        className="mb-2"
        segments={[
          {
            text: "완성도 높은 서비스를 만드는 개발 방식.",
          },
        ]}
      />
      <WordsPullUpMultiStyle
        segments={[
          {
            text: "몰입에서 시작해서, 구조로 완성합니다.",
            className: "text-gray-500",
          },
        ]}
      />
    </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          <VideoCard />
          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={card.number} data={card} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
