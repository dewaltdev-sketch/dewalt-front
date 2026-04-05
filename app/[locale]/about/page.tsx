import AboutPage from "@/features/about/aboutPage";
import { getSettings } from "@/features/settings/server/getSettings";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = (await getLocale()) as "ka" | "en";
  const settings = await getSettings();

  return (
    <AboutPage
      title={settings?.aboutTitle?.[locale] ?? ""}
      subtitle={settings?.aboutSubtitle?.[locale] ?? ""}
      content={settings?.aboutContent?.[locale] ?? ""}
    />
  );
}
