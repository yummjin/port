import { PATH } from "@/shared/constants";
import { geistMono, geistSans, gothicA1 } from "@/styles/font";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { AiFillProject } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";
import { HiSquare3Stack3D } from "react-icons/hi2";
import { IoIosMail } from "react-icons/io";

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
        <main className="h-screen w-screen grid place-items-center">
          <div>
            <p className="font-point-bold text-6xl tracking-wider">PortFolio</p>
            <p className="font-point-dot text-4xl">of..<span className="text-sm">★</span> <span className="font-wagon-italic">Yujin</span></p>
            {/* <Image
              src="/profile.jpeg"
              alt="profile"
              width={180}
              height={135}
              className="grayscale mt-4"
            /> */}
            <div className="gap-4 flex mt-4">
              <a
                href="https://github.com/yummjin"
                className="hover:text-main text-xl font-point-dot flex gap-1 items-center"
                target="_blank"
              >
                github<BsGithub size={16} />

              </a>
              <HomeLink title="contact" href={PATH.USER} icon={<IoIosMail />} />
              <HomeLink title="skills" href={PATH.SKILLS} icon={<HiSquare3Stack3D size={18} />
              } />
              <HomeLink title="projects" href={PATH.PROJECTS} icon={<AiFillProject />} />
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

function HomeLink({ title, href, icon }: { title: string, href: string, icon: ReactNode }) {
  return <Link href={href} className="hover:text-main text-xl font-point-dot flex gap-1 items-center">
    {title} {icon}
  </Link>
}