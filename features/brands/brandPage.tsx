import Image from "next/image";
import classNames from "classnames";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";
import { BRAND_STATIC_INFO, type BrandKey } from "./brandInfo";
import type { BrandTextBlock } from "./server/getBrandContent";

interface BrandPageProps {
  brandKey: BrandKey;
  brandSlug: string;
  lang: "ka" | "en";
  content?: BrandTextBlock;
}

export default function BrandPage({
  brandKey,
  brandSlug,
  lang,
  content,
}: BrandPageProps) {
  const brandInfo = BRAND_STATIC_INFO[brandKey];

  return (
    <div className="min-h-screen py-10 pt-15">
      <div className="customContainer">
        {/* Brand Header */}
        <div className="mb-10 flex flex-col items-center gap-6 md:mb-12">
          <div className="flex items-center justify-center pt-8">
            <Image
              src={brandInfo.pageLogo}
              alt={brandInfo.name}
              width={200}
              height={92}
              className={classNames("h-16 w-auto md:h-24", {
                "brightness-100 grayscale": brandInfo.slug === "dewalt",
              })}
            />
          </div>
          <h1 className="font-bpg-web-002-caps text-dark-secondary-100 text-center text-3xl md:text-4xl">
            {brandInfo.name}
          </h1>
        </div>

        {/* Brand Information Section */}
        <div className="mx-auto max-w-4xl space-y-8 px-5 md:px-0">
          <div className="space-y-4">
            <div
              className="text-dark-secondary-100 prose max-w-none leading-7 md:text-base [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:list-outside [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:list-outside"
              dangerouslySetInnerHTML={{
                __html: normalizeRichTextHtml(content?.aboutContent?.[lang]),
              }}
            />
          </div>

          {/* Call to Action Button */}
          <div className="flex justify-center pt-8">
            <Button
              variant="dark"
              size="default"
              className="w-full md:w-auto"
              asChild
            >
              <Link href={`/products?brand=${brandSlug}`}>
                {lang === "ka"
                  ? `იხილეთ ${brandInfo.name} პროდუქტები`
                  : `View ${brandInfo.name} products`}
              </Link>
            </Button>
          </div>

          {/* Official Website Link */}
          {brandInfo.website && (
            <div className="flex justify-center pt-4">
              <Link
                href={brandInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline md:text-base"
              >
                {lang === "ka" ? "ოფიციალური ვებ-გვერდი →" : "Official website →"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
