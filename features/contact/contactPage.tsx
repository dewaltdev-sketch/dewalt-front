"use client";

import LocationIcon from "@/components/icons/locationIcon";
import PhoneIcon from "@/components/icons/phoneIcon";
import EnvelopIcon from "@/components/icons/envelopIcon";
import FbIcon from "@/components/icons/fbIcon";
import InstagramIcon from "@/components/icons/instagramIcon";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useTranslations } from "next-intl";

type ContactInfo = {
  phone1: string;
  phone2?: string | null;
  email: string;
  facebookUrl: string;
  instagramUrl?: string;
  address: string;
};

export default function ContactPage({ contact }: { contact: ContactInfo }) {
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.contact") },
  ];

  const phone1 = contact.phone1?.trim();
  const phone2 = contact.phone2?.trim();
  const email = contact.email?.trim();
  const facebookUrl = contact.facebookUrl?.trim();
  const instagramUrl = contact.instagramUrl?.trim();
  const address = contact.address?.trim();

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      {/* Header Section */}
      <div className="bg-background mb-8 py-8 text-center md:mb-12 md:py-12">
        <div className="mx-auto max-w-[1080px] px-5">
          <h1 className="text-dark-secondary-100 text-2xl font-semibold md:text-4xl">
            {t("contact.title")}
          </h1>
          <p className="text-dark-secondary-70 mt-4 text-sm md:text-base">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="mx-auto max-w-[1080px] px-5 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Location Card */}
          <div className="bg-background group hover:border-primary rounded-lg border border-gray-200 p-6 transition-all hover:shadow-lg">
            <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <LocationIcon className="text-primary" />
            </div>
            <h3 className="text-dark-secondary-100 mb-2 text-lg font-semibold">
              {t("contact.address")}
            </h3>
            <p className="text-dark-secondary-70 text-sm leading-relaxed">
              {address}
            </p>
          </div>

          {/* Phone Card */}
          <div className="bg-background group hover:border-primary rounded-lg border border-gray-200 p-6 transition-all hover:shadow-lg">
            <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <PhoneIcon className="text-primary" />
            </div>
            <h3 className="text-dark-secondary-100 mb-2 text-lg font-semibold">
              {t("contact.phone")}
            </h3>
            <a
              href={`tel:${phone1.replace(/\s+/g, "")}`}
              className="text-dark-secondary-70 hover:text-primary text-sm transition-colors"
            >
              {phone1}
            </a>
            {phone2 ? (
              <a
                href={`tel:${phone2.replace(/\s+/g, "")}`}
                className="text-dark-secondary-70 hover:text-primary mt-2 block text-sm transition-colors"
              >
                {phone2}
              </a>
            ) : null}
          </div>

          {/* Email Card */}
          <div className="bg-background group hover:border-primary rounded-lg border border-gray-200 p-6 transition-all hover:shadow-lg md:col-span-2 lg:col-span-1">
            <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <div className="text-primary">
                <EnvelopIcon />
              </div>
            </div>
            <h3 className="text-dark-secondary-100 mb-2 text-lg font-semibold">
              {t("contact.email")}
            </h3>
            <a
              href={`mailto:${email}`}
              className="text-dark-secondary-70 hover:text-primary text-sm break-all transition-colors"
            >
              {email}
            </a>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 text-center">
          <h2 className="text-dark-secondary-100 mb-6 text-xl font-semibold">
            {t("contact.followUs")}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {facebookUrl ? (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-background hover:border-primary flex items-center gap-3 rounded-lg border border-gray-200 px-6 py-4 transition-all hover:shadow-lg"
              >
                <FbIcon />
                <span className="text-dark-secondary-100 group-hover:text-primary font-medium">
                  Facebook
                </span>
              </a>
            ) : null}
            {instagramUrl ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-background hover:border-primary flex items-center gap-3 rounded-lg border border-gray-200 px-6 py-4 transition-all hover:shadow-lg"
              >
                <InstagramIcon />
                <span className="text-dark-secondary-100 group-hover:text-primary font-medium">
                  Instagram
                </span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-dark-secondary-100 mb-6 text-xl font-semibold">
            {t("contact.ourLocation")}
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps?q=41.76816341342369%2C44.78538133558222&hl=ka&z=17&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full md:h-[500px]"
              title="Dewalt Georgia Location"
            ></iframe>
          </div>
          <p className="text-dark-secondary-70 mt-4 text-center text-sm">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}
