import ProductsPage from "@/features/products/productsPage";
import {
  buildCanonicalUrl,
  buildLanguageAlternates,
  getSafeLocale,
} from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = getSafeLocale(routeLocale);
  const canonicalUrl = buildCanonicalUrl(locale, "/products");

  return {
    title: locale === "ka" ? "პროდუქტები" : "Products",
    description:
      locale === "ka"
        ? "DEWALT-ის ხელსაწყოები და აქსესუარები საქართველოში."
        : "DEWALT tools and accessories in Georgia.",
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates("/products"),
    },
    openGraph: {
      title: locale === "ka" ? "პროდუქტები" : "Products",
      description:
        locale === "ka"
          ? "DEWALT-ის ხელსაწყოები და აქსესუარები საქართველოში."
          : "DEWALT tools and accessories in Georgia.",
      url: canonicalUrl,
      type: "website",
    },
  };
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    brandId?: string;
    categoryId?: string;
    childCategoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ProductPage({ searchParams }: PageProps) {
  return <ProductsPage searchParams={searchParams} />;
}
