import { fetchApi } from "@/lib/apiClient.server";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { devLogger } from "@/lib/devLogger";

export type LocalizedText = { ka: string; en: string };

export interface TermsApi {
  key: "main";
  content?: LocalizedText;
}

export async function getTerms(): Promise<TermsApi | null> {
  try {
    return await fetchApi<TermsApi>(API_ROUTES.TERMS, {
      revalidate: 60 * 60 * 24 * 30,
      tags: [...CACHE_TAGS.terms.all],
    });
  } catch (error) {
    devLogger.log("Failed to fetch terms on server:", error);
    return null;
  }
}
