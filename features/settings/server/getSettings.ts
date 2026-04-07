/**
 * Server-side function to fetch site settings (public).
 * Used for footer contact info, etc.
 */

import { fetchApi } from "@/lib/apiClient.server";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { devLogger } from "@/lib/devLogger";

export type LocalizedText = { ka: string; en: string };

export interface SettingsApi {
  key: "main";
  contactPhone?: string;
  contactPhone2?: string;
  contactEmail?: string;
  contactFacebook?: string;
  contactInstagram?: string;
  contactAddress?: LocalizedText;
  aboutTitle?: LocalizedText;
  aboutSubtitle?: LocalizedText;
  aboutContent?: LocalizedText;
  freeDeliveryEnabled: boolean;
  deliveryRegionFreeOver: number;
  deliveryRegionPrice: number;
  deliveryTbilisiFreeOver: number;
  deliveryTbilisiPrice: number;
}

export async function getSettings(): Promise<SettingsApi | null> {
  try {
    return await fetchApi<SettingsApi>(API_ROUTES.SETTINGS, {
      revalidate: 60 * 60 * 24 * 30, // 30 days
      tags: [...CACHE_TAGS.settings.all],
    });
  } catch (error) {
    devLogger.log("Failed to fetch settings on server:", error);
    return null;
  }
}
