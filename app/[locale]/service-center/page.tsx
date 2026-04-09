import ServiceCenterPage from "@/features/serviceCenter/serviceCenterPage";
import { getServiceCenter } from "@/features/serviceCenter/server/getServiceCenter";
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = (await getLocale()) as "ka" | "en";
  const data = await getServiceCenter();

  return (
    <ServiceCenterPage
      heroTitle={data?.heroTitle?.[locale] ?? ""}
      contentHtml={data?.content?.[locale] ?? ""}
      imageUrl={data?.imageUrl ?? ""}
    />
  );
}
