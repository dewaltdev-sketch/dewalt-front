import NewsPage from "@/features/news/newsPage";
import { NewsErrorBoundary } from "@/features/news/components/errorBoundary";
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
  const canonicalUrl = buildCanonicalUrl(locale, "/news");

  return {
    title: locale === "ka" ? "სიახლეები" : "News",
    description:
      locale === "ka"
        ? "DEWALT-ის სიახლეები, სტატიები და განახლებები საქართველოში."
        : "DEWALT news, articles, and updates in Georgia.",
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates("/news"),
    },
    openGraph: {
      title: locale === "ka" ? "სიახლეები" : "News",
      description:
        locale === "ka"
          ? "DEWALT-ის სიახლეები, სტატიები და განახლებები საქართველოში."
          : "DEWALT news, articles, and updates in Georgia.",
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <NewsErrorBoundary>
      <NewsPage searchParams={searchParams} />
    </NewsErrorBoundary>
  );
}
