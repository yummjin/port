import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGithub } from "react-icons/bs";
import { SiVelog } from "react-icons/si";

import {
  ChevronRight,
  HomeIcon,
  MenuButton,
  YoutubeLogo,
} from "@/shared/assets";
import { PROJECTS } from "@/shared/assets";
import { PATH } from "@/shared/constants";
import { cn } from "@/shared/utils";

import SidebarButton from "./SidebarButton";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="bg-background flex h-screen w-[72px] flex-shrink-0 flex-col xl:hidden">
        <header className="flex h-14 items-center pl-4.5">
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-full focus:outline-none active:bg-white/30">
            <MenuButton className="size-6" />
          </button>
        </header>
        <SidebarButton.Mobile
          href={PATH.HOME}
          icon={<HomeIcon className="size-6" />}
          label="홈"
          isActive={isActive(PATH.HOME)}
        />
      </div>
      <div className="bg-background hidden h-screen w-[240px] flex-shrink-0 flex-col xl:flex">
        <header className="flex h-14 items-center pl-4">
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-full focus:outline-none active:bg-white/30">
            <MenuButton className="size-6" />
          </button>
          <YoutubeLogo className="ml-4 h-5" />
        </header>
        <section className="border-border flex w-full flex-col border-b-[1px] p-3 pr-6">
          <SidebarButton
            href={PATH.HOME}
            icon={<HomeIcon className="size-6" />}
            label="홈"
            isActive={isActive(PATH.HOME)}
          />
          <SidebarButton
            href="https://github.com/yummjin"
            icon={<BsGithub className="size-6" />}
            label="Github"
            isActive={isActive("https://github.com/yummjin")}
            target="_blank"
          />
          <SidebarButton
            href="https://velog.io/@yummjin"
            icon={<SiVelog className="size-6" />}
            label="Velog"
            isActive={isActive("https://github.com/yummjin")}
            target="_blank"
          />
        </section>
        <section className="border-border flex w-full flex-col border-b-[1px] p-3 pr-6">
          <Link
            href={PATH.PROJECTS}
            className={cn(
              "hover:bg-card-background box-border flex h-10 w-full items-center rounded-[10px] px-3 active:bg-white/20",
              isActive(PATH.PROJECTS) && "bg-card-background text-foreground",
            )}
          >
            프로젝트
            <ChevronRight className="ml-2 size-4" />
          </Link>
          {PROJECTS.map((project) => (
            <SidebarButton
              key={project.id}
              href={`/projects/${project.id}`}
              label={project.title}
              isActive={isActive(`/projects/${project.id}`)}
              icon={
                <Image
                  src={project.icon || ""}
                  alt={project.title}
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover"
                />
              }
            />
          ))}
        </section>
        <section className="border-border flex w-full flex-col border-b-[1px] p-3 pr-6">
          <Link
            href={PATH.USER}
            className={cn(
              "hover:bg-card-background box-border flex h-10 w-full items-center rounded-[10px] px-3 active:bg-white/20",
              isActive(PATH.USER) && "bg-card-background text-foreground",
            )}
          >
            내 페이지
            <ChevronRight className="ml-2 size-4" />
          </Link>
        </section>
      </div>
    </>
  );
}
