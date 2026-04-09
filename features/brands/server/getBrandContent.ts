import { fetchApi } from "@/lib/apiClient.server";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { devLogger } from "@/lib/devLogger";

export type LocalizedText = { ka: string; en: string };

export type BrandTextBlock = {
  cardDescription?: LocalizedText;
  aboutContent?: LocalizedText;
};

export interface BrandContentApi {
  key: "main";
  dewalt?: BrandTextBlock;
  stanley?: BrandTextBlock;
  blackDecker?: BrandTextBlock;
}

export async function getBrandContent(): Promise<BrandContentApi | null> {
  try {
    return await fetchApi<BrandContentApi>(API_ROUTES.BRAND_CONTENT, {
      revalidate: 60 * 60 * 24 * 30,
      tags: [...CACHE_TAGS.brandContent.all],
    });
  } catch (error) {
    devLogger.log("Failed to fetch brand content on server:", error);
    return null;
  }
}
