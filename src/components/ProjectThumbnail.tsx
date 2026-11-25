import Image from "next/image";

import { Card } from "@/components/Card";
import type { ProjectMeta } from "@/lib/projects";

type Props = Pick<ProjectMeta, "title" | "description" | "icon"> & {
  period?: string;
  role?: string;
};

function formatPeriod(period: string) {
  const dates = period.match(/\d{4}\.\d{2}|현재/g) ?? [];
  const start = dates[0];
  const end = dates[dates.length - 1];
  return start === end ? start : `${start} – ${end}`;
}

export function ProjectThumbnail({
  title,
  description,
  icon,
  period,
  role,
}: Props) {
  const meta = [period && formatPeriod(period), role?.split(",")[0]]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card.Image className="flex aspect-[4/3] flex-col justify-between p-5">
      <Image src={icon} alt="" width={64} height={64} className="" />
      <div className="flex flex-col gap-1">
        <h2 className="text-section text-foreground text-[20px] leading-[26px]">
          {title}
        </h2>
        <Card.Description className="line-clamp-2">
          {description}
        </Card.Description>
        {meta && (
          <p className="text-caption text-muted mt-2 self-end">{meta}</p>
        )}
      </div>
    </Card.Image>
  );
}
