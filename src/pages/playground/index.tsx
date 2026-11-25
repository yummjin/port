import Head from "next/head";
import Link from "next/link";
import {
  RiFilePdf2Fill,
  RiImageEditFill,
  RiPokerSpadesFill,
} from "react-icons/ri";

import { PageHeader } from "@/components/PageHeader";

const EXPERIMENTS = [
  {
    href: "/playground/mighty",
    title: "마이티",
    description: "5명이 모이면? 마이티~",
    Icon: RiPokerSpadesFill,
  },
  {
    href: "/playground/image-editor",
    title: "이미지 편집기",
    description: "HTML 이미지 합성 라이브러리를 실험하는 편집 공간",
    Icon: RiImageEditFill,
  },
  {
    href: "/playground/pdf-editor",
    title: "PDF 편집기",
    description: "여러 PDF를 합치고 페이지 순서를 바꾸는 도구",
    Icon: RiFilePdf2Fill,
  },
];

export default function PlaygroundPage() {
  return (
    <>
      <Head>
        <title>Playground</title>
        <meta name="description" content="Yujin's playground" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-8 pt-12 pb-20">
        <PageHeader
          title="Playground"
          description="작은 실험과 인터랙션을 모아두는 곳이에요."
        />

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
          {EXPERIMENTS.map(({ href, title, description, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col gap-2 transition-opacity duration-200 hover:opacity-70"
              >
                <div className="border-border bg-canvas text-foreground flex aspect-square w-full items-center justify-center border">
                  <Icon className="size-1/4" aria-hidden />
                </div>
                <h2 className="text-tile-heading text-foreground mt-1">
                  {title}
                </h2>
                <p className="text-caption text-muted">{description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
