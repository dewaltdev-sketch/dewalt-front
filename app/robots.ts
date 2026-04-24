import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://dewaltstore.ge";

const PRIVATE_PATHS = [
  "/cart",
  "/checkout",
  "/compare",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email",
  "/payment-status",
  "/profile",
] as const;

function getBaseUrl() {
  return SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
}

function getLocalizedPrivatePaths() {
  return routing.locales.flatMap((locale) =>
    PRIVATE_PATHS.map((path) => `/${locale}${path}`)
  );
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", ...getLocalizedPrivatePaths()],
      },
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`,
    host: getBaseUrl(),
  };
}
