import NewsDetail from "@/features/news/newsDetail";
import { NewsErrorBoundary } from "@/features/news/components/errorBoundary";
import { extractIdFromSlug } from "@/lib/utils/extractIdFromSlug";
import {
  buildCanonicalUrl,
  buildLanguageAlternatesByLocale,
  Locale,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getNewsById } from "@/features/news/server";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { transformNewsApiToNews } from "@/features/news/utils/transformNews";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  // Extract ID from hybrid slug
  const id = await extractIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  return (
    <NewsErrorBoundary>
      <NewsDetail id={id} />
    </NewsErrorBoundary>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activeLocale = (await getLocale()) as Locale;
  const locale = routing.locales.includes(activeLocale)
    ? activeLocale
    : routing.defaultLocale;

  const id = await extractIdFromSlug(slug);
  if (!id) {
    return { title: "News not found" };
  }
  const newsApi = await getNewsById(id);

  if (!newsApi) {
    return { title: "News not found" };
  }
  const news = transformNewsApiToNews(newsApi, locale);
  const canonicalPath = `/news/${news.slug}`;
  const pathsByLocale = Object.fromEntries(
    routing.locales.map((alternateLocale) => [alternateLocale, canonicalPath])
  ) as Partial<Record<Locale, string>>;
  const canonicalUrl = buildCanonicalUrl(locale, canonicalPath);

  return {
    title: news.name,
    description: news.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternatesByLocale(pathsByLocale),
    },
    openGraph: {
      title: news.name,
      type: "article",
      description: news.description.substring(0, 160),
      url: canonicalUrl,
      images: [
        {
          url: news.image,
          width: 1200,
          height: 630,
          alt: news.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: news.name,
      description: news.description.substring(0, 160),
      images: [news.image],
    },
  };
}
