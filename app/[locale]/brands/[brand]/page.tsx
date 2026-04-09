import BrandPage from "@/features/brands/brandPage";
import { BRAND_KEY_BY_SLUG } from "@/features/brands/brandInfo";
import { getBrandContent } from "@/features/brands/server/getBrandContent";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    brand: string;
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { brand, locale } = await params;
  const normalizedBrand = brand.toLowerCase();

  if (!BRAND_KEY_BY_SLUG[normalizedBrand]) {
    return notFound();
  }

  const brandKey = BRAND_KEY_BY_SLUG[normalizedBrand];
  const content = await getBrandContent();

  return (
    <BrandPage
      brandKey={brandKey}
      brandSlug={normalizedBrand}
      lang={locale === "ka" ? "ka" : "en"}
      content={content?.[brandKey]}
    />
  );
}
