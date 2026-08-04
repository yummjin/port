"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import { PATH } from "@/shared/constants";

import { WordsPullUp } from "./animations";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_ITEMS = [
  { label: "Home", href: PATH.HOME },
  { label: "About me", href: PATH.USER },
  { label: "Blog", href: PATH.BLOG },
  { label: "Project", href: PATH.PROJECTS },
  { label: "Playground", href: PATH.PLAYGROUND },
] as const;

const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

export function PrismaHero() {
  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={HERO_VIDEO_SRC}
          className="absolute h-full w-full object-cover"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/30 via-transparent to-[#000000]/60" />

        <nav className="absolute inset-x-0 top-0 z-20 flex justify-center">
          <div className="rounded-b-2xl bg-[#000000] px-4 py-2 md:rounded-b-3xl md:px-8">
            <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
              {NAV_ITEMS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[10px] leading-[1.333] tracking-[-0.01em] transition-colors sm:text-xs md:text-sm"
                  style={{ color: "rgba(255, 255, 255, 0.8)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#2997ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 lg:p-14">
          <h1
            className="text-[22vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] xl:text-[15vw] 2xl:text-[16vw]"
            style={{ color: "#ffffff" }}
          >
            <WordsPullUp text="Yujin" showAsterisk />
          </h1>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <motion.p
              className="max-w-sm text-xs leading-[1.6] tracking-[-0.005em] text-white/70 sm:text-sm md:max-w-md md:text-base"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            >
              코드로 사용자의 일상에 자연스럽게 스며드는 경험을 만듭니다.
              <br />
              한번 시작한 목표는 끝까지 밀어붙이며,
              <br />
              그 과정에서 서비스 품질과 개발 경험을 함께 챙겨왔습니다.
              <br />
              지금에 안주하지 않고, 늘 더 나은 구조를 고민합니다.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            >
              <Link
                href={PATH.PROJECTS}
                className="group inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-black py-1.5 pl-5 pr-1.5 text-sm font-medium tracking-[-0.022em] text-white transition-[gap] hover:gap-3 sm:text-base"
              >
                프로젝트 보기
                <span className="flex size-9 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110 sm:size-10">
                  <FiArrowRight className="text-black" size={16} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
