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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const id = await extractIdFromSlug(slug);
  if (!id) {
    return { title: "News not found" };
  }
  const newsApi = await getNewsById(id);

  if (!newsApi) {
    return { title: "News not found" };
  }
  return {
    title: newsApi.title,
    description: newsApi.summary,
    openGraph: {
      title: newsApi.title,
      type: "article",
      description: newsApi.summary.substring(0, 160),
      images: [
        {
          url: newsApi.imageUrl,
          width: 1200,
          height: 630,
          alt: newsApi.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: newsApi.title,
      description: newsApi.summary.substring(0, 160),
      images: [newsApi.imageUrl],
    },
  };
}
