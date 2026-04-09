import { fetchApi } from "@/lib/apiClient.server";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { devLogger } from "@/lib/devLogger";

export type LocalizedText = { ka: string; en: string };

export interface ServiceCenterApi {
  key: "main";
  heroTitle?: LocalizedText;
  content?: LocalizedText;
  imageUrl?: string;
}

export async function getServiceCenter(): Promise<ServiceCenterApi | null> {
  try {
    return await fetchApi<ServiceCenterApi>(API_ROUTES.SERVICE_CENTER, {
      revalidate: 60 * 60 * 24 * 30,
      tags: [...CACHE_TAGS.serviceCenter.all],
    });
  } catch (error) {
    devLogger.log("Failed to fetch service center on server:", error);
    return null;
  }
}
