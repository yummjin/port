import { ReactNode } from "react";
import { GiBarbute } from "react-icons/gi";

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-background/70 fixed top-0 z-50 flex w-full flex-col backdrop-blur-xl">
        <div className="border-border box-border flex h-14 items-center justify-between">
          <span className="text-lg font-bold"></span>
          <div className="bg-border flex h-10 w-14 items-center justify-center rounded-r-full text-sm font-medium">
            <GiBarbute className="size-5" />
          </div>
        </div>
        <div className="flex items-center gap-2 py-3">
          <span className="text-background flex h-[32px] w-fit items-center justify-center rounded-[8px] bg-white px-3 text-sm font-medium">
            전체
          </span>
          <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
            프로젝트
          </span>
          <span className="bg-card-background flex h-[32px] w-fit items-center justify-center rounded-[8px] px-3 text-sm font-medium text-white">
            기술스택
          </span>
        </div>
      </header>
      <div className="scrollbar-hide mt-[calc(112px+24px)] mb-12 flex flex-col gap-12">
        {children}
      </div>
    </>
  );
}
