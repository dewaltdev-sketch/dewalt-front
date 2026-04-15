"use client";

import { cn } from "@/lib/utils";

export default function ProductDescription({
  description,
  className,
}: {
  description: string;
  className?: string;
}) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: description }}
      className={cn(
        "text-text-secondary mb-1 line-clamp-2 text-xs md:mb-3 md:line-clamp-3 [&_*]:!leading-[calc(1/.75)]",
        className
      )}
    ></div>
  );
}
