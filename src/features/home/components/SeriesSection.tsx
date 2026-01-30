import { CardWrapper } from "@/shared/components";

import { SeriesCard } from "./SeriesCard";
import type { Post } from "../model/series";

export default function SeriesSection({
  posts,
  activeTagName,
}: {
  posts: Post[];
  activeTagName: string | null;
}) {
  const listKey = activeTagName ?? "all";

  return (
    <CardWrapper>
      {posts.map((content, index) => (
        <SeriesCard
          key={`${listKey}-${content.href}`}
          content={content}
          index={index}
        />
      ))}
    </CardWrapper>
  );
}

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
