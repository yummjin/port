"use client";

import { useScroll } from "motion/react";
import { useRef } from "react";

import { AnimatedLetter, WordsPullUpMultiStyle } from "./animations";

const BODY_TEXT =
  "여러 프로덕트를 만들며 사용자 경험과 코드 품질을 함께 고민해 왔습니다.\n작은 디테일부터 전체 구조까지, 더 나은 방법을 찾는 과정을 즐깁니다.";

function ScrollRevealParagraph() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = BODY_TEXT.split("");
  const total = chars.length;

  return (
    <p
      ref={ref}
      className="mx-auto max-w-2xl text-xs leading-[1.6] tracking-[-0.005em] text-white/70 sm:text-sm md:text-base"
    >
      {chars.map((char, i) => {
        const charProgress = i / total;
        const range: [number, number] = [
          Math.max(0, charProgress - 0.1),
          charProgress + 0.05,
        ];
        return (
          <AnimatedLetter
            key={i}
            char={char}
            progress={scrollYProgress}
            range={range}
          />
        );
      })}
    </p>
  );
}

export function PrismaAbout() {
  return (
    <section className="bg-[#000000] px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-6 py-16 text-center sm:px-10 md:py-24">
        <p className="text-primary mb-6 text-[10px] leading-[1.333] tracking-[-0.01em] sm:text-xs">
          Frontend Developer
        </p>

        <div className="mx-auto mb-10 max-w-3xl text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.4] md:text-5xl lg:text-6xl xl:text-7xl">
          <WordsPullUpMultiStyle
            className="mb-2"
            segments={[{ text: "안녕하세요, 한유진입니다.", className: "font-semibold" }]}
          />
          <WordsPullUpMultiStyle
            className="mb-2"
            segments={[{ text: "코드로 사용자 경험을 만드는 개발자입니다." }]}
          />
          <WordsPullUpMultiStyle
            segments={[
              {
                text: "프론트엔드 아키텍처부터 성능 최적화, 협업 문화까지 고민합니다.",
                className: "font-semibold",
              },
            ]}
          />
        </div>

        <ScrollRevealParagraph />
      </div>
    </section>
  );
}
