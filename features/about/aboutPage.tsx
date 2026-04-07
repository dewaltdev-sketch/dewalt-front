"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

export default function AboutPage({
  title,
  subtitle,
  content,
}: {
  title?: string;
  subtitle?: string;
  content?: string;
}) {
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.about") },
  ];
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      {/* Hero Section with Gradient and Background Image */}
      <div
        style={{ backgroundSize: "cover" }}
        className="relative min-h-[400px] bg-cover md:min-h-[600px] md:bg-[url('/imgs/aboutBg.png')] md:bg-contain md:bg-top-right md:bg-no-repeat"
      >
        {/* Gradient Overlay */}
        <div className="min-h-[700px] bg-[url('/imgs/Vector3.png')] bg-cover bg-center bg-no-repeat md:min-h-0 md:bg-none">
          {/* Content */}
          <div className="customContainer md:pbs-16 relative z-10 flex min-h-[400px] flex-col justify-start p-0 pt-50 pb-4 md:min-h-[600px] md:pt-2">
            <div className="max-w-2xl md:pt-16">
              {title?.trim() ? (
                <h1 className="text-primary font-bpg-web-002-caps mb-2 text-center text-2xl md:text-left md:text-3xl">
                  {title}
                </h1>
              ) : null}
              {subtitle?.trim() ? (
                <h2 className="text-primary font-bpg-web-002-caps mb-4 text-center md:text-left">
                  {subtitle}
                </h2>
              ) : null}
              {content?.trim() ? (
                <div
                  className="text-neutral prose prose-invert max-w-none text-sm leading-relaxed wrap-break-word **:wrap-break-word [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="text-neutral text-sm leading-relaxed">
                  {t("about.officialPartner")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
