/**
 * Cache tags (similar to React Query keys) for Next fetch caching.
 * Keep strings stable and re-use everywhere.
 */
export const CACHE_TAGS = {
  /**
   * Single menu tag used for both brands list + menu brands tree.
   * Revalidate rarely, keep invalidation simple.
   */
  menu: {
    all: ["menu"] as const,
  },
  settings: {
    all: ["settings"] as const,
  },
  terms: {
    all: ["terms"] as const,
  },
  brandContent: {
    all: ["brand-content"] as const,
  },
  serviceCenter: {
    all: ["service-center"] as const,
  },
  bannerCarousel: {
    all: ["banner-carousel"] as const,
  },
  ads: {
    all: ["ads"] as const,
  },
  news: {
    all: ["news"] as const,
  },
  products: {
    all: ["products"] as const,
  },
} as const;
