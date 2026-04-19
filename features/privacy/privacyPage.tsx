"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.privacy") },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-background mb-8 py-8 text-center md:mb-12 md:py-12">
        <div className="mx-auto max-w-[1080px] px-5">
          <h1 className="text-dark-secondary-100 text-2xl font-semibold md:text-4xl">
            {t("privacy.title")}
          </h1>
          <p className="text-text-secondary mt-3 text-sm md:text-base">
            {t("privacy.subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] px-5 pb-12">
        <div className="bg-background rounded-lg p-6 md:p-8">
          <div className="prose prose-sm md:prose-base text-text-secondary max-w-none [&_ul]:ml-5 [&_ul]:list-outside [&_ul]:list-disc">
            <p>{t("privacy.intro")}</p>

            <section className="mt-8">
              <h2 className="text-dark-secondary-100 text-xl font-semibold md:text-2xl">
                {t("privacy.dataWeCollectTitle")}
              </h2>
              <p>{t("privacy.dataWeCollectIntro")}</p>
              <ul>
                <li>{t("privacy.accountData")}</li>
                <li>{t("privacy.orderData")}</li>
                <li>{t("privacy.technicalData")}</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-dark-secondary-100 text-xl font-semibold md:text-2xl">
                {t("privacy.whyWeUseTitle")}
              </h2>
              <ul>
                <li>{t("privacy.whyWeUseAuth")}</li>
                <li>{t("privacy.whyWeUseOrders")}</li>
                <li>{t("privacy.whyWeUseSupport")}</li>
                <li>{t("privacy.whyWeUseSecurity")}</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-dark-secondary-100 text-xl font-semibold md:text-2xl">
                {t("privacy.cookiesTitle")}
              </h2>
              <p>{t("privacy.cookiesIntro")}</p>

              <p>{t("privacy.noMarketingCookies")}</p>
            </section>

            <section className="mt-8">
              <h2 className="text-dark-secondary-100 text-xl font-semibold md:text-2xl">
                {t("privacy.thirdPartiesTitle")}
              </h2>
              <ul>
                <li>{t("privacy.thirdPartyPayment")}</li>
                <li>{t("privacy.thirdPartyComments")}</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-dark-secondary-100 text-xl font-semibold md:text-2xl">
                {t("privacy.securityTitle")}
              </h2>
              <p>{t("privacy.securityText")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
