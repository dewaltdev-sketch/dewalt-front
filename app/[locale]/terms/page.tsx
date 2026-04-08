import TermsPage from "@/features/terms/termsPage";
import { getTerms } from "@/features/terms/server/getTerms";
import { getLocale } from "next-intl/server";

export default async function Terms() {
  const locale = (await getLocale()) as "ka" | "en";
  const terms = await getTerms();

  return <TermsPage content={terms?.content?.[locale] ?? ""} />;
}

