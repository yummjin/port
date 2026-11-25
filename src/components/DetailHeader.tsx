import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type DetailMetaItem = {
  label: string;
  content: ReactNode;
  /** Content draws its own cells, so skip the default padding. */
  bare?: boolean;
};

export function DetailHeader({
  title,
  description,
  meta,
}: {
  title: string;
  description?: string;
  meta: DetailMetaItem[];
}) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-section text-foreground">{title}</h1>
        {description && (
          <p className="text-body-small text-secondary">{description}</p>
        )}
      </div>

      {meta.length > 0 && (
        <dl className="flex flex-wrap gap-2">
          {meta.map(({ label, content, bare }) => (
            <div
              key={label}
              className="border-foreground text-body-small flex max-w-full border"
            >
              <dt className="border-foreground text-muted shrink-0 border-r px-3 py-1">
                {label}
              </dt>
              <dd
                className={cn(
                  "text-foreground flex min-w-0 items-center",
                  !bare && "px-3 py-1",
                )}
              >
                {content}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
