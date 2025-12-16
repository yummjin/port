import Image from "next/image";
import Link from "next/link";
import { IoLink } from "react-icons/io5";
import { SiVelog } from "react-icons/si";

import { Card, CardWrapper } from "@/shared/components";

import type { Post, Series } from "../model/series";

export default function SeriesSection({ series }: { series: Series }) {
  //   if (!series) {
  //     return (
  //       <CardWrapper>
  //         {Array.from({ length: 6 }).map((_, index) => (
  //           <VideoCardSkeleton key={index} />
  //         ))}
  //       </CardWrapper>
  //     );
  //   }

  return (
    <CardWrapper>
      {series.contents.slice(0, 6).map((content) => (
        <VideoCard key={content.href} content={content} />
      ))}
    </CardWrapper>
  );
}

const VideoCard = ({ content }: { content: Post }) => (
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
        <p className="line-clamp-1 leading-none">
          {content.title.split(".")[1]}
        </p>
        <p className="text-text-muted line-clamp-1 text-sm leading-none font-normal">
          {content.body.slice(0, 40)}
        </p>
        <p className="text-text-muted text-xs leading-none font-normal">
          {content.date}
        </p>
      </div>
    </div>
  </Link>
);

// const VideoCardSkeleton = () => (
//   <div className="flex flex-col gap-3">
//     <Card>
//       <div className="h-full w-full animate-pulse bg-gray-600 dark:bg-gray-700" />
//     </Card>
//     <div className="flex items-start gap-3">
//       <div className="size-9 shrink-0 animate-pulse rounded-full bg-gray-600 dark:bg-gray-700" />
//       <div className="flex flex-1 flex-col gap-0.5">
//         <div className="h-4 w-3/4 animate-pulse rounded bg-gray-600 dark:bg-gray-700" />
//         <div className="flex flex-col gap-1">
//           <div className="h-3 w-full animate-pulse rounded bg-gray-600 dark:bg-gray-700" />
//           <div className="h-3 w-5/6 animate-pulse rounded bg-gray-600 dark:bg-gray-700" />
//         </div>
//         <div className="h-3 w-1/3 animate-pulse rounded bg-gray-600 dark:bg-gray-700" />
//       </div>
//     </div>
//   </div>
// );
