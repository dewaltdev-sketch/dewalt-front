import type { MetadataRoute } from "next";
import { getProducts } from "@/features/products/server";
import { fetchApi } from "@/lib/apiClient.server";
import { API_ROUTES } from "@/lib/apiRoutes";
import { routing } from "@/i18n/routing";
import { BRAND_STATIC_INFO } from "@/features/brands/brandInfo";
import slugify from "slugify";

type Locale = (typeof routing.locales)[number];

type SitemapEntry = MetadataRoute.Sitemap[number];

type NewsApi = {
  _id: string;
  title: string;
  updatedAt: string;
};

type PaginatedNewsResponse = {
  data: NewsApi[];
  totalPages: number;
};

const PRODUCTS_PAGE_SIZE = 100;
const NEWS_PAGE_SIZE = 100;
const DAY_IN_SECONDS = 60 * 60 * 24;
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://dewaltstore.ge";

const STATIC_PATHS = [
  "",
  "/products",
  "/news",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/service-center",
] as const;

const SLUGIFY_OPTIONS: Parameters<typeof slugify>[1] = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
};

function getBaseUrl() {
  return SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
}

function localizePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}

function buildUrl(path: string) {
  return `${getBaseUrl()}${path}`;
}

function generateSitemapSlug(title: string, id?: string) {
  const normalizedTitle =
    typeof title === "string" && title.trim().length > 0 ? title : "product";

  return id
    ? `${slugify(normalizedTitle, SLUGIFY_OPTIONS)}-${id}`
    : slugify(normalizedTitle, SLUGIFY_OPTIONS);
}

function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, buildUrl(localizePath(locale, path))])
    ),
  };
}

function buildStaticEntriesForPath(path: string): SitemapEntry[] {
  return routing.locales.map((locale) => ({
    url: buildUrl(localizePath(locale, path)),
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7,
    alternates: buildAlternates(path),
  }));
}

function buildBrandEntries(): SitemapEntry[] {
  return routing.locales.flatMap((locale) =>
    Object.values(BRAND_STATIC_INFO).map((brand) => ({
      url: buildUrl(localizePath(locale, `/brands/${brand.slug}`)),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: buildAlternates(`/brands/${brand.slug}`),
    }))
  );
}

async function getAllProducts(locale: Locale) {
  const firstPage = await getProducts(1, PRODUCTS_PAGE_SIZE, { language: locale });
  const remainingPages = Array.from(
    { length: Math.max(0, firstPage.totalPages - 1) },
    (_, index) => index + 2
  );

  const remainingResponses = await Promise.all(
    remainingPages.map((page) =>
      getProducts(page, PRODUCTS_PAGE_SIZE, { language: locale })
    )
  );

  return [firstPage, ...remainingResponses].flatMap((response) => response.data);
}

async function getNewsPage(page: number, locale: Locale) {
  return await fetchApi<PaginatedNewsResponse>(API_ROUTES.NEWS_PUBLIC, {
    params: {
      page: page.toString(),
      limit: NEWS_PAGE_SIZE.toString(),
    },
    revalidate: DAY_IN_SECONDS,
    headers: {
      "x-custom-lang": locale,
    },
  });
}

async function getAllNews(locale: Locale) {
  const firstPage = await getNewsPage(1, locale);
  const remainingPages = Array.from(
    { length: Math.max(0, firstPage.totalPages - 1) },
    (_, index) => index + 2
  );

  const remainingResponses = await Promise.all(
    remainingPages.map((page) => getNewsPage(page, locale))
  );

  return [firstPage, ...remainingResponses].flatMap((response) => response.data);
}

async function buildProductEntries(): Promise<SitemapEntry[]> {
  const localizedProducts = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      products: await getAllProducts(locale),
    }))
  );

  const localizedSlugMap = new Map<
    string,
    Partial<Record<Locale, string>>
  >();

  localizedProducts.forEach(({ locale, products }) => {
    products.forEach((product) => {
      const slugByLocale = localizedSlugMap.get(product._id) ?? {};
      slugByLocale[locale] = generateSitemapSlug(product.name, product._id);
      localizedSlugMap.set(product._id, slugByLocale);
    });
  });

  return localizedProducts.flatMap(({ locale, products }) =>
    products.map((product) => {
      const slug = generateSitemapSlug(product.name, product._id);
      const slugByLocale = localizedSlugMap.get(product._id) ?? {};

      return {
        url: buildUrl(localizePath(locale, `/products/${slug}`)),
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales
              .map((altLocale) => {
                const altSlug = slugByLocale[altLocale];
                if (!altSlug) return null;
                return [
                  altLocale,
                  buildUrl(localizePath(altLocale, `/products/${altSlug}`)),
                ];
              })
              .filter((entry) => entry !== null)
          ),
        },
      };
    })
  );
}

async function buildNewsEntries(): Promise<SitemapEntry[]> {
  const localizedNews = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      articles: await getAllNews(locale),
    }))
  );

  const localizedSlugMap = new Map<
    string,
    Partial<Record<Locale, string>>
  >();

  localizedNews.forEach(({ locale, articles }) => {
    articles.forEach((article) => {
      const slugByLocale = localizedSlugMap.get(article._id) ?? {};
      slugByLocale[locale] = generateSitemapSlug(article.title, article._id);
      localizedSlugMap.set(article._id, slugByLocale);
    });
  });

  return localizedNews.flatMap(({ locale, articles }) =>
    articles.map((article) => {
      const slug = generateSitemapSlug(article.title, article._id);
      const slugByLocale = localizedSlugMap.get(article._id) ?? {};

      return {
        url: buildUrl(localizePath(locale, `/news/${slug}`)),
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales
              .map((altLocale) => {
                const altSlug = slugByLocale[altLocale];
                if (!altSlug) return null;
                return [altLocale, buildUrl(localizePath(altLocale, `/news/${altSlug}`))];
              })
              .filter((entry) => entry !== null)
          ),
        },
      };
    })
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productEntries, newsEntries] = await Promise.all([
    buildProductEntries(),
    buildNewsEntries(),
  ]);

  return [
    ...STATIC_PATHS.flatMap((path) => buildStaticEntriesForPath(path)),
    ...buildBrandEntries(),
    ...productEntries,
    ...newsEntries,
  ];
}
