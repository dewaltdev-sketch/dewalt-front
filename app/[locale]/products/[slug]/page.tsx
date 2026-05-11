import ProductDetailsPage from "@/features/products/productDetailsPage";
import { getProductById } from "@/features/products/server";
import { extractIdFromSlug } from "@/lib/utils/extractIdFromSlug";
import { generateSlug } from "@/lib/utils/slugify";
import {
  buildCanonicalUrl,
  buildLanguageAlternatesByLocale,
  buildSocialImageUrl,
  getImageMimeType,
  Locale,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const language = (await getLocale()) as "ka" | "en";

  return <ProductDetailsPage slug={slug} language={language} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: routeLocale } = await params;
  const locale = routing.locales.includes(routeLocale as Locale)
    ? (routeLocale as Locale)
    : routing.defaultLocale;

  const id = await extractIdFromSlug(slug);
  if (!id) {
    return { title: "Product not found" };
  }

  const product = await getProductById(id, locale);
  if (!product) {
    return { title: "Product not found" };
  }

  const description = product.description.substring(0, 160);
  const canonicalPath = `/products/${generateSlug(product.name, product._id)}`;
  const localizedProducts = await Promise.all(
    routing.locales.map(async (alternateLocale) => {
      const localizedProduct =
        alternateLocale === locale
          ? product
          : await getProductById(id, alternateLocale);

      return [
        alternateLocale,
        localizedProduct
          ? `/products/${generateSlug(localizedProduct.name, localizedProduct._id)}`
          : undefined,
      ] as const;
    })
  );
  const pathsByLocale = Object.fromEntries(
    localizedProducts.filter((entry) => entry[1])
  ) as Partial<Record<Locale, string>>;
  const canonicalUrl = buildCanonicalUrl(locale, canonicalPath);
  const imageUrl = buildSocialImageUrl(product.image);
  const imageType = imageUrl ? getImageMimeType(product.image) : undefined;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternatesByLocale(pathsByLocale),
    },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: canonicalUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              secureUrl: imageUrl,
              width: 1200,
              height: 630,
              alt: product.name,
              type: imageType,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : undefined,
    },
  };
}
