import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://dewaltstore.ge";

export function getSiteUrl() {
  return SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
}

export function getMetadataBase() {
  return new URL(`${getSiteUrl()}/`);
}

export function getSafeLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildLocalizedPath(locale: Locale, path = "") {
  return `/${locale}${normalizePath(path)}`;
}

export function buildAbsoluteUrl(path = "") {
  return `${getSiteUrl()}${normalizePath(path) || "/"}`;
}

export function buildSocialImageUrl(imageUrl: string) {
  const trimmedImageUrl = imageUrl.trim();

  if (!trimmedImageUrl) return undefined;

  let absoluteImageUrl: string;

  try {
    absoluteImageUrl =
      trimmedImageUrl.startsWith("http://") ||
      trimmedImageUrl.startsWith("https://")
        ? new URL(trimmedImageUrl).toString()
        : buildAbsoluteUrl(trimmedImageUrl);
  } catch {
    return undefined;
  }

  const params = new URLSearchParams({
    url: absoluteImageUrl,
    w: "1200",
    q: "75",
  });

  return buildAbsoluteUrl(`/_next/image?${params.toString()}`);
}

export function getImageMimeType(imageUrl: string) {
  let pathname: string;

  try {
    pathname = new URL(imageUrl).pathname.toLowerCase();
  } catch {
    pathname = imageUrl.toLowerCase();
  }

  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  return undefined;
}

export function buildCanonicalUrl(locale: Locale, path = "") {
  return buildAbsoluteUrl(buildLocalizedPath(locale, path));
}

export function buildLanguageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, buildCanonicalUrl(locale, path)])
    ),
    "x-default": buildCanonicalUrl(routing.defaultLocale, path),
  };
}

export function buildLanguageAlternatesByLocale(
  pathsByLocale: Partial<Record<Locale, string>>
) {
  const languages = Object.fromEntries(
    routing.locales
      .map((locale) => {
        const path = pathsByLocale[locale];
        if (!path) return null;
        return [locale, buildCanonicalUrl(locale, path)];
      })
      .filter((entry): entry is [Locale, string] => entry !== null)
  );

  const defaultPath = pathsByLocale[routing.defaultLocale];
  if (defaultPath) {
    return {
      ...languages,
      "x-default": buildCanonicalUrl(routing.defaultLocale, defaultPath),
    };
  }

  return languages;
}
