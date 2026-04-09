export type BrandKey = "dewalt" | "stanley" | "blackDecker";

export interface BrandStaticInfo {
  name: string;
  slug: string;
  cardLogo: string;
  pageLogo: string;
  website?: string;
}

export const BRAND_STATIC_INFO: Record<BrandKey, BrandStaticInfo> = {
  dewalt: {
    name: "Dewalt",
    slug: "dewalt",
    cardLogo: "/imgs/dwalt.png",
    pageLogo: "/imgs/dwalt.png",
    website: "https://www.dewalt.com",
  },
  stanley: {
    name: "Stanley",
    slug: "stanley",
    cardLogo: "/imgs/stanley@2x 1.png",
    pageLogo: "/imgs/stanley.png",
    website: "https://www.stanleytools.com",
  },
  blackDecker: {
    name: "Black&Decker",
    slug: "black-decker",
    cardLogo: "/imgs/black-decker.svg",
    pageLogo: "/imgs/black-decker.svg",
    website: "https://www.blackanddecker.com",
  },
};

export const BRAND_KEY_BY_SLUG: Record<string, BrandKey> = {
  dewalt: "dewalt",
  stanley: "stanley",
  "black-decker": "blackDecker",
};
