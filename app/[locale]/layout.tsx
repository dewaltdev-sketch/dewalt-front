import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import localfont from "next/font/local";

import "./globals.css";

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import CompareProductProvider from "@/features/products/compare/compareContext/CompareProductProvider";
import CompareLinkButton from "@/features/products/compare/components/compareLinkButton";
import CartProvider from "@/features/products/cart/cartContext/CartProvider";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/features/auth";
import { SessionProvider } from "next-auth/react";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Suspense } from "react";
import LanguageInterceptor from "@/components/providers/LanguageInterceptor";
import { getMenuBrands } from "@/features/categories/server/getMenuBrands";
import { getBrands } from "@/features/categories/server/getBrands";
import { AppIntlProvider } from "./providers";
import { getMetadataBase } from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const bpgWeb002Caps = localfont({
  src: [
    {
      path: "../../public/fonts/bpg-web-002-caps-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/bpg-web-002-caps-webfont.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bpg-web-002-caps",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // If locale is invalid, let the page flow handle it (RootLayout will 404),
  // but still return a safe metadata object here.
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const messages = (await import(`@/messages/${safeLocale}.json`)).default as {
    meta?: { siteTitle?: string; siteDescription?: string };
  };

  const siteTitle = messages?.meta?.siteTitle || "DEWALT Georgia";
  const siteDescription =
    messages?.meta?.siteDescription ||
    "Official DEWALT products in Georgia — tools, accessories, news, and service support.";

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    applicationName: siteTitle,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [menuBrandsData, brandsData] = await Promise.all([
    getMenuBrands(locale),
    getBrands(locale),
  ]);

  const messages = (await import(`@/messages/${locale}.json`))
    .default as unknown as Parameters<typeof AppIntlProvider>[0]["messages"];

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${roboto.variable} ${bpgWeb002Caps.variable} antialiased`}
      >
        <AppIntlProvider locale={locale} messages={messages}>
          <LanguageInterceptor />
          <QueryProvider>
            <SessionProvider>
              <AuthProvider>
                <Toaster position="top-right" richColors closeButton />

                <CartProvider>
                  <Header menuBrands={menuBrandsData} />
                  <Suspense fallback={null}>
                    <ScrollToTop />
                  </Suspense>

                  <CompareProductProvider>
                    <>
                      {children}
                      <CompareLinkButton />
                    </>
                  </CompareProductProvider>
                </CartProvider>
                <Footer brands={brandsData} />
              </AuthProvider>
            </SessionProvider>
          </QueryProvider>
        </AppIntlProvider>
      </body>
    </html>
  );
}
