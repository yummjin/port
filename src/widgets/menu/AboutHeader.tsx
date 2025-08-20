"use client";

import { useRef, useState } from "react";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { PATH } from "@/shared/constants/path";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { cn } from "@/shared/utils";

const buttons = [
  { label: "한유진", value: PATH.USER },
  { label: "기술", value: PATH.SKILLS },
  { label: "프로젝트", value: PATH.PROJECTS },
  { label: "해커톤", value: PATH.HACKATHONS },
];

export default function AboutHeader() {
  const current = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="box-border hidden w-full border-b-[1px] border-gray-200 md:block">
        <div className="hidden justify-between md:flex md:w-full lg:w-fit lg:gap-12">
          {buttons.map((button) => (
            <button
              key={button.value}
              onClick={() => router.push(button.value)}
              className={cn(
                "cursor-pointer font-sans py-4 font-normal outline-none",
                button.value === current && "border-b-[1px] border-black"
              )}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
      <Variants />
    </>
  );
}

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

function Variants() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      ref={containerRef}
      className="sticky top-[44px] left-4 flex w-full bg-white py-3 md:hidden"
    >
      <motion.div variants={sidebarVariants} />
      <Navigation isOpen={isOpen} />
      <MenuToggle toggle={() => setIsOpen(!isOpen)} />
    </motion.nav>
  );
}

const Navigation = ({ isOpen }: { isOpen: boolean }) => (
  <motion.ul
    className="absolute top-[44px] w-screen list-none bg-white pt-[25px]"
    variants={navVariants}
    initial="closed"
    animate={isOpen ? "open" : "closed"}
  >
    {buttons.map((button, index) => (
      <MenuItem key={index} {...button} />
    ))}
  </motion.ul>
);

const MenuItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <motion.a
      className="m-0 mb-5 flex font-sans cursor-pointer list-none items-center justify-start p-0"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      href={`/detail${value}`}
    >
      {label}
    </motion.a>
  );
};

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button onClick={toggle}>
    <svg width="20" height="20" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const navVariants = {
  open: {
    opacity: 1,
    visibility: "visible",
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    opacity: 0,
    visibility: "hidden",
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const sidebarVariants: Variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};
