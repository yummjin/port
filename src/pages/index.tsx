import { motion } from "motion/react";
import Head from "next/head";

import { RootLayout } from "@/shared/layouts";

const particles = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
  xMove: Math.random() * 50 - 25,
  yMove: Math.random() * 60 - 30,
}));

export default function Home() {
  return (
    <RootLayout>
      <Head>
        <title>yummjin</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <section className="relative flex h-[calc(100vh-88px)] w-full flex-col overflow-hidden">
        <div className="absolute relative top-60 left-0 h-2/5">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="pointer-events-none absolute rounded-full bg-white/30"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, particle.yMove, 0, -particle.yMove, 0],
                x: [0, particle.xMove, -particle.xMove, particle.xMove / 2, 0],
                opacity: [1],
                scale: [1, 1.2, 0.8, 1.1, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.2) 0%, transparent 60%),
              linear-gradient(to top, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.4) 100%)
            `,
          }}
        />
        <div
          className="absolute right-1/2 bottom-0 mx-auto w-[200vw] rounded-[50%] border border-[0.5px] border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.3),0_0_100px_rgba(255,255,255,0.4)]"
          style={{
            height: "100vw",
            transform: "translateX(50%) translateY(65%)",
          }}
        />
      </section>
    </RootLayout>
  );
}
