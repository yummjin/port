import { PATH } from "@/shared/constants";
import { geistMono, geistSans, gothicA1 } from "@/styles/font";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>한유진</title>
        <meta name="description" content="프론트엔드 개발자 한유진입니다" />
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} ${gothicA1.variable} min-w-screen min-h-screen`}
      >
        <main>
          <div className="font-mono p-10 flex flex-col gap-4 text-main">
            <Image
              src="/profile.jpeg"
              alt="profile"
              width={180}
              height={135}
              className="grayscale mb-2"
            />
            <h1 className="text-3xl font-sans font-bold ">한유진</h1>
            <h4 className="text-2xl">Frontend Developer</h4>
            <p className="font-normal text-xl ">
              Always learning, <br />
              always building.
            </p>
            <div className="flex gap-4 text-black">
              <a
                href="https://github.com/yummjin"
                className="underline hover:text-main"
                target="_blank"
              >
                github
              </a>
              <Link href={PATH.USER} className="underline hover:text-main">
                contact
              </Link>
              <Link href={PATH.SKILLS} className="underline hover:text-main">
                skills
              </Link>
              <Link href={PATH.PROJECTS} className="underline hover:text-main">
                projects
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
