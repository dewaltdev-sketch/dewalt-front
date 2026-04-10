import Image from "next/image";
import Breadcrumb from "@/components/ui/breadcrumb";
import { DateIcon } from "@/components/icons/date";
import RecentlyAddedNews from "./components/recentlyAddedNews";
import ShareButton from "@/components/ui/ShareButton";
import { getTranslations, getLocale } from "next-intl/server";
import { getNewsById } from "./server/getNews";
import { transformNewsApiToNews } from "./utils/transformNews";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

export default async function NewsDetail({ id }: { id: string }) {
  const t = await getTranslations();

  const locale = (await getLocale()) as "ka" | "en";

  const newsApi = await getNewsById(id);
  if (!newsApi) {
    notFound();
  }

  const news = transformNewsApiToNews(newsApi, locale);

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.news"), href: "/news" },
    { label: news.name },
  ];
  console.log(newsApi, "news from newsDetail");
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-neutral md:bg-background mb-10 md:mb-18">
        <div className="mx-auto max-w-[1070px] px-[15px] py-8 pt-0 md:pt-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
            {/* Main Article */}
            <article className="border-line-color min-w-0 md:border-r md:pr-6">
              {/* Featured Image */}
              <div className="relative mb-4 aspect-496/379 w-full overflow-hidden md:mb-6">
                <Image
                  src={news.image}
                  alt={news.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 760px"
                />
              </div>

              {/* Article Header */}
              <div className="mb-4">
                <h1 className="text-dark-secondary-100 font-bpg-web-002-caps mb-4 text-2xl md:text-3xl">
                  {news.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <DateIcon />
                    <span className="text-text-secondary text-xs">
                      {news.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="text-text-secondary mb-6 space-y-4 border-b border-[#D2D2D2] pb-4 text-sm leading-relaxed">
                {/* <p>{news.description}</p> */}
                {news.fullContent && (
                  <div dangerouslySetInnerHTML={{ __html: news.fullContent }} />
                )}
              </div>

              <ShareButton url={`/${locale}/news/${news.slug}-${news._id}`} />
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:sticky lg:top-8 lg:h-fit">
              <Suspense
                fallback={
                  <Loading message={t("news.loading")} minHeight="60vh" />
                }
              >
                <RecentlyAddedNews currentNewsId={news._id} />
              </Suspense>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
