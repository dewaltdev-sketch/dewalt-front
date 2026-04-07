import ContactPage from "@/features/contact/contactPage";
import { getSettings } from "@/features/settings/server/getSettings";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = (await getLocale()) as "ka" | "en";
  const settings = await getSettings();

  const phone1 = settings?.contactPhone?.trim() || "";
  const phone2 = settings?.contactPhone2?.trim() || null;
  const email = settings?.contactEmail?.trim() || "";
  const facebookUrl = settings?.contactFacebook?.trim() || "";
  const instagramUrl = settings?.contactInstagram?.trim() || "";

  const address = settings?.contactAddress?.[locale]?.trim() || "";

  return (
    <ContactPage
      contact={{ phone1, phone2, email, facebookUrl, instagramUrl, address }}
    />
  );
}
