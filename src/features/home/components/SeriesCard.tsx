"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IoLink } from "react-icons/io5";
import { SiVelog } from "react-icons/si";

import { Card } from "@/shared/components";

import type { Post } from "../model/series";

export const SeriesCard = ({
  content,
  index = 0,
}: {
  content: Post;
  index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: index * 0.06,
    }}
  >
    <Link
      href={content.href}
      target="_blank"
      className="group flex cursor-pointer flex-col gap-4"
    >
      <Card>
        <Image
          src={content.image}
          alt={content.title}
          fill
          className="object-cover object-center"
        />
        <div className="group-hover:bg-background/30 absolute inset-0 bg-transparent group-hover:opacity-100">
          <div className="group-hover:bg-background absolute top-4 right-4 flex size-9 shrink-0 items-center justify-center rounded-full bg-transparent">
            <IoLink className="size-4 text-transparent group-hover:text-white" />
          </div>
        </div>
      </Card>
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
          <SiVelog className="text-background size-4" />
        </div>
        <div className="flex flex-col gap-2 font-semibold">
          <p className="line-clamp-1 leading-none">{content.title}</p>
          <p className="text-text-muted line-clamp-1 text-sm leading-none font-normal">
            {content.body.slice(0, 40)}
          </p>
          <p className="text-text-muted text-xs leading-none font-normal">
            {content.date}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
);
