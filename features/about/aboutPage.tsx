"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import Image from "next/image";
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
      <div className="min-h-[400px] md:relative md:min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 hidden md:block">
          {/* Mobile: Image at top */}

          {/* Desktop: Image on right side */}
          <div className="hidden md:block">
            <div className="absolute top-0 right-0 h-full w-full">
              <Image
                src="/imgs/Vector2.png"
                alt="DEWALT Tools"
                fill
                className="object-cover object-right"
                sizes="100vw"
              />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="inset-0 min-h-[700px] bg-[url('/imgs/Vector3.png')] bg-cover bg-center bg-no-repeat md:absolute md:min-h-auto md:bg-none">
          {/* Content */}
          <div className="customContainer md:pbs-16 relative z-10 flex h-full min-h-[400px] flex-col justify-start pt-50 md:min-h-[600px] md:pt-20">
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
                  className="text-neutral prose prose-invert max-w-none text-sm leading-relaxed [&_p]:mb-3 [&_ul]:pl-5 [&_ol]:pl-5"
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
