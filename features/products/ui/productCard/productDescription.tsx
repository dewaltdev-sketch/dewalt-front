"use client";
export default function ProductDescription({
  description,
}: {
  description: string;
}) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: description }}
      className="text-text-secondary mb-1 line-clamp-2 text-xs md:mb-3 md:line-clamp-3 [&_*]:!leading-[calc(1/.75)]"
    ></div>
  );
}
