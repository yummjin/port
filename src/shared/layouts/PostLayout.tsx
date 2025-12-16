import { ReactNode } from "react";

export default function PostLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="scrollbar-hide mt-6 mb-20 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex h-34 flex-col items-center justify-center gap-4">
            <h1 className="text-center text-xl leading-none font-semibold">
              {title}
            </h1>
            <p className="text-text-muted text-sm leading-none font-normal">
              {description}
            </p>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
