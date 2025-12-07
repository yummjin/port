import Head from "next/head";
import Image from "next/image";

import { DESCRIPTION } from "@/shared/data";

import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <Head>
        <title>Yujin Han - About</title>
        <meta
          name="description"
          content="프론트엔드 개발자 한유진의 포트폴리오입니다"
        />
      </Head>

      <section className="flex flex-col">
        <header className="bg-background/70 fixed top-0 z-50 flex w-full flex-col pt-6 backdrop-blur-xl">
          <div className="flex gap-6">
            <div className="relative size-30 overflow-hidden rounded-full object-cover">
              <Image
                src="/profile.jpeg"
                alt="한유진"
                fill
                objectFit="cover"
                loading="lazy"
                blurDataURL="/profile.jpeg"
                placeholder="blur"
              />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <p className="text-[36px] leading-none font-bold">한유진</p>
              <p className="text-text-muted text-sm">{DESCRIPTION.email}</p>
            </div>
          </div>
        </header>
      </section>
    </Layout>
  );
}
