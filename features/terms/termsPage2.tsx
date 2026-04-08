"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

export default function TermsPage() {
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
          <div className="prose prose-sm md:prose-base max-w-none">
            {/* Terms and Conditions Section */}
            <section className="mb-12">
              <h2 className="text-dark-secondary-100 mb-6 text-xl font-semibold md:text-2xl">
                {t("terms.termsAndConditions")}
              </h2>
              <p className="text-text-secondary mb-4 text-sm leading-relaxed md:text-base">
                {t("terms.intro")}
              </p>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.greeting")}
              </p>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.purchaseConditions")}
              </h3>

              <ul className="text-text-secondary mb-6 space-y-3 text-sm leading-relaxed md:text-base">
                <li>{t("terms.paymentMethods")}</li>
                <li>{t("terms.courierService")}</li>
              </ul>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.deliveryConditions")}
              </h3>

              <ul className="text-text-secondary mb-6 space-y-3 text-sm leading-relaxed md:text-base">
                <li>{t("terms.freeDelivery")}</li>
                <li>{t("terms.paidDelivery")}</li>
                <li>{t("terms.sameDayDelivery")}</li>
                <li>{t("terms.nextDayDelivery")}</li>
                <li>{t("terms.countryDelivery")}</li>
                <li>{t("terms.deliveryNote")}</li>
              </ul>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.returnConditions")}
              </h3>

              <ul className="text-text-secondary mb-6 space-y-3 text-sm leading-relaxed md:text-base">
                <li>{t("terms.returnPolicy")}</li>
                <li>{t("terms.returnRequirements")}</li>
                <li>{t("terms.returnExclusions")}</li>
              </ul>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.refundConditions")}
              </h3>

              <ul className="text-text-secondary mb-6 space-y-3 text-sm leading-relaxed md:text-base">
                <li>{t("terms.refundPolicy")}</li>
                <li>{t("terms.overpaymentRefund")}</li>
                <li>{t("terms.duplicateRefund")}</li>
                <li>{t("terms.refundTimeline")}</li>
              </ul>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.contactInfo")}
              </h3>

              <ul className="text-text-secondary mb-6 space-y-3 text-sm leading-relaxed md:text-base">
                <li>+(995) 577 95 55 82</li>
                <li>{t("terms.address")}</li>
                <li>
                  <a
                    href="mailto:ksanisale@dewaltgeorgia.com"
                    className="text-primary hover:underline"
                  >
                    ksanisale@dewaltgeorgia.com
                  </a>
                </li>
              </ul>
            </section>

            {/* Privacy Policy Section */}
            <section className="mb-12 border-t border-gray-200 pt-12">
              <h2 className="text-dark-secondary-100 mb-6 text-xl font-semibold md:text-2xl">
                {t("terms.privacyPolicy")}
              </h2>
              <p className="text-text-secondary mb-4 text-sm leading-relaxed md:text-base">
                {t("terms.privacyIntro")}
              </p>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.privacyCommitment")}
              </p>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.privacySecurity")}
              </p>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.privacyContact")}
              </p>
            </section>

            {/* Security Section */}
            <section className="border-t border-gray-200 pt-12">
              <h2 className="text-dark-secondary-100 mb-6 text-xl font-semibold md:text-2xl">
                {t("terms.security")}
              </h2>
              <p className="text-text-secondary mb-4 text-sm leading-relaxed md:text-base">
                {t("terms.securityIntro")}
              </p>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.accountSecurity")}
              </h3>
              <p className="text-text-secondary mb-4 text-sm leading-relaxed md:text-base">
                {t("terms.accountSecurityDesc")}
              </p>
              <p className="text-text-secondary mb-4 text-sm leading-relaxed md:text-base">
                {t("terms.accountRequirements")}
              </p>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.accountSecurityNote")}
              </p>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.securityTips")}
              </h3>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.securityTipsDesc")}
              </p>

              <h3 className="text-dark-secondary-100 mt-8 mb-4 text-lg font-semibold md:text-xl">
                {t("terms.systemSecurity")}
              </h3>
              <p className="text-text-secondary mb-6 text-sm leading-relaxed md:text-base">
                {t("terms.systemSecurityDesc")}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
