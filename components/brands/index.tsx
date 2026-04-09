import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import classNames from "classnames";
import { BRAND_STATIC_INFO, type BrandKey } from "@/features/brands/brandInfo";
import { getBrandContent } from "@/features/brands/server/getBrandContent";

const brandKeys: BrandKey[] = ["dewalt", "stanley", "blackDecker"];

export default async function Brands() {
  const locale = ((await getLocale()) === "ka" ? "ka" : "en") as "ka" | "en";
  const t = await getTranslations({ locale });
  const content = await getBrandContent();

  return (
    <div className="customContainer bg-background px-5 pt-18 pb-10 md:bg-transparent md:px-0">
      <h2 className="font-bpg-web-002-caps text-dark-secondary-100 mb-4 text-2xl md:mb-6 md:text-2xl">
        {t("brands.title")}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {brandKeys.map((brandKey) => {
          const brand = BRAND_STATIC_INFO[brandKey];
          const description = content?.[brandKey]?.cardDescription?.[locale] ?? "";

          return (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="bg-primary flex cursor-pointer flex-col gap-8 rounded-lg border-2 border-solid border-black p-12 shadow-md transition-transform hover:scale-105"
            >
              {/* Brand Logo/Name */}
              <div className="border-dark-secondary-100">
                <Image
                  src={brand.cardLogo}
                  alt={brand.name}
                  width={400}
                  height={184}
                  className={classNames("m-auto h-10 w-auto")}
                />
              </div>

              {/* Description */}
              <p className="text-dark-secondary-100 flex-1 text-center text-sm leading-6">
                {description}
              </p>

              {/* Button */}
              <Button variant="dark" className="m-auto w-[229px]">
                {t("common.viewAll")}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
