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
  const primaryRole = role?.split(",")[0].replace("프론트엔드 개발", "FE");

  return (
    <Card.Image className="flex aspect-[4/3] flex-col justify-between p-5">
      <Image src={icon} alt="" width={64} height={64} className="" />
      <div className="flex flex-col gap-1">
        <Card.Title>{title}</Card.Title>
        <Card.Description className="line-clamp-2">
          {description}
        </Card.Description>
        {(period || primaryRole) && (
          <div className="border-border text-caption text-foreground divide-border mt-2 flex divide-x self-end border">
            {primaryRole && (
              <span className="px-1.5 py-0.5">{primaryRole}</span>
            )}
            {period && (
              <span className="px-1.5 py-0.5">{formatPeriod(period)}</span>
            )}
          </div>
        )}
      </div>
    </Card.Image>
  );
}
