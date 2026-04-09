"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";
import ServiceCenterStaticFallback from "./serviceCenterStaticFallback";

type Props = {
  heroTitle?: string;
  contentHtml?: string;
  imageUrl?: string;
};

export default function ServiceCenterPage({
  heroTitle,
  contentHtml,
  imageUrl,
}: Props) {
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.serviceCenter") },
  ];

  const hasCmsBody = Boolean(contentHtml?.trim());
  const imgSrc = imageUrl?.trim() || "/imgs/service.png";
  const isRemoteImg = imgSrc.startsWith("http");

  if (!hasCmsBody) {
    return (
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <ServiceCenterStaticFallback />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      {heroTitle?.trim() ? (
        <div className="bg-background mb-6 py-6 text-lg md:py-14 md:text-2xl">
          <div className="text-dark-secondary-100 mx-auto max-w-[1080px] px-5">
            {heroTitle}
          </div>
        </div>
      ) : null}

      <div className="mt-8 mb-5 flex justify-center md:mt-14 md:justify-center">
        <Image
          src={imgSrc}
          alt=""
          width={800}
          height={480}
          className="max-h-[480px] w-auto object-contain"
          unoptimized={isRemoteImg}
        />
      </div>

      <div className="mx-auto max-w-[1080px] px-5 pb-14">
        <div
          className="text-dark-secondary-100 prose prose-sm sm:prose-base max-w-none [&_ol]:ml-5 [&_ol]:list-outside [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-outside [&_ul]:list-disc"
          dangerouslySetInnerHTML={{
            __html: normalizeRichTextHtml(contentHtml),
          }}
        />
      </div>
    </div>
  );
}
