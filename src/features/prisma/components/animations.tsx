"use client";

import {
  type MotionValue,
  motion,
  useInView,
  useTransform,
} from "motion/react";
import { useRef } from "react";

const PULL_UP_EASE = [0.16, 1, 0.3, 1] as const;

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export function WordsPullUp({
  text,
  className,
  showAsterisk,
}: WordsPullUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="relative inline-block"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: PULL_UP_EASE }}
        >
          {word}
          {showAsterisk && i === words.length - 1 && (
            <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]">
              *
            </span>
          )}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

interface Segment {
  text: string;
  className?: string;
}

export function WordsPullUpMultiStyle({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  let wordIndex = 0;

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap justify-center ${className ?? ""}`}
    >
      {segments.map((segment, si) =>
        segment.text.split(" ").map((word, wi) => {
          const idx = wordIndex++;
          return (
            <motion.span
              key={`${si}-${wi}`}
              className={`mr-[0.25em] inline-block ${segment.className ?? ""}`}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: PULL_UP_EASE,
              }}
            >
              {word}
            </motion.span>
          );
        }),
      )}
    </span>
  );
}

interface AnimatedLetterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

export function AnimatedLetter({
  char,
  progress,
  range,
}: AnimatedLetterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  if (char === "\n") return <br />;
  return (
    <motion.span style={{ opacity }}>{char === " " ? " " : char}</motion.span>
  );
}
