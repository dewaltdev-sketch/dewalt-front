"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

export default function TermsPage({ content }: { content?: string }) {
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.terms") },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="bg-background mb-8 py-8 text-center md:mb-12 md:py-12">
        <div className="mx-auto max-w-[1080px] px-5">
          <h1 className="text-dark-secondary-100 text-2xl font-semibold md:text-4xl">
            {t("footer.termsAndConditions")}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-[1080px] px-5 pb-12">
        <div className="bg-background rounded-lg p-6 md:p-8">
          <div className="prose prose-sm md:prose-base max-w-none text-text-secondary [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:pl-5">
            {content?.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div>{t("terms.intro")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
