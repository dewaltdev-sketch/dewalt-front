"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { useRouter } from "@/i18n/navigation";
import useGetMyOrders from "@/features/orders/hooks/useGetMyOrders";
import type { OrderItemDetails, UserOrder } from "@/features/orders/types";
import moment from "moment";
import { Link } from "@/i18n/navigation";
import { generateSlug } from "@/lib/utils/slugify";
import Pagination from "@/features/products/components/pagination";

export default function OrdersPage() {
  const t = useTranslations();
  const router = useRouter();
  const { status: authStatus } = useSession();

  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const limit = 10;
  const { data, isLoading, isError, isFetching } = useGetMyOrders({
    page,
    limit,
  });

  const orders = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = data?.pages ?? 1;
  const clampedPage = Math.min(Math.max(page, 1), totalPages);

  const getStatusLabel = (status: UserOrder["status"]) => {
    if (status === "paid") return t("paymentStatus.paid");
    if (status === "pending") return t("paymentStatus.pending");
    if (status === "shipped") return t("paymentStatus.shipped");
    if (status === "delivered") return t("paymentStatus.delivered");
    return status;
  };

  const getStatusClasses = (status: UserOrder["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "shipped":
      case "delivered":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getProductImage = (item: OrderItemDetails) => {
    if (typeof item.productId === "string") return null;
    return item.productId?.image ?? null;
  };

  // Auth gating (page is under profile area)
  if (authStatus === "loading") {
    return <Loading message={t("orders.loading")} minHeight="screen" />;
  }
  if (authStatus === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold sm:mb-8">{t("orders.title")}</h1>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <Loading message={t("orders.loading")} />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-red-600">{t("orders.error")}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">{t("orders.empty")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = Boolean(expanded[order._id]);
            const detailsId = `order-${order._id}-details`;
            return (
              <div
                key={order._id}
                className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow ${
                  isFetching ? "opacity-70" : "hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [order._id]: !prev[order._id],
                    }))
                  }
                  aria-expanded={isOpen}
                  aria-controls={detailsId}
                  className="group focus-visible:ring-primary/40 w-full px-4 py-4 text-left transition-colors outline-none hover:bg-gray-50/60 focus-visible:ring-2 sm:px-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm text-gray-500">
                          {t("orders.orderCode")}
                        </span>
                        <span className="text-base font-semibold text-gray-900">
                          {order.uuid || "-"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {moment(order.createdAt).format("DD.MM.YYYY HH:mm")}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-gray-600 sm:grid-cols-2 sm:gap-x-6">
                        <p className="min-w-0 truncate">
                          <span className="text-gray-500">
                            {t("profile.name")}:
                          </span>{" "}
                          <span className="font-medium text-gray-800">
                            {order.name} {order.surname}
                          </span>
                        </p>
                        <p className="min-w-0 truncate">
                          <span className="text-gray-500">
                            {t("profile.phone")}:
                          </span>{" "}
                          <span className="font-medium text-gray-800">
                            {order.phone}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>

                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:items-end sm:gap-2">
                        <div className="rounded-lg bg-gray-50 px-3 py-2 text-left sm:text-right">
                          <p className="text-[11px] font-medium text-gray-500">
                            {t("orders.orderPrice")}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            GEL {order.subtotal}
                          </p>
                        </div>
                        <div className="rounded-lg bg-gray-50 px-3 py-2 text-left sm:text-right">
                          <p className="text-[11px] font-medium text-gray-500">
                            {t("orders.deliveryPrice")}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            GEL {order.deliveryPrice}
                          </p>
                        </div>
                        <div className="col-span-2 rounded-lg bg-gray-50 px-3 py-2 text-left sm:col-span-1 sm:text-right">
                          <p className="text-[11px] font-medium text-gray-500">
                            {t("orders.total")}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            GEL {order.total}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-col gap-2">
                      <span className="text-gray-600">
                        {t("orders.deliveryType.label")}:{" "}
                        <span className="font-medium text-gray-800">
                          {t(`orders.deliveryType.${order.deliveryType}`)}
                        </span>
                      </span>
                      <span className="min-w-0 text-gray-600">
                        {t("orders.address")}:{" "}
                        <span className="font-medium wrap-break-word text-gray-800">
                          {order.address}
                        </span>
                      </span>
                    </div>

                    <span className="text-primary inline-flex items-center gap-2 font-semibold">
                      {isOpen
                        ? t("orders.hideDetails")
                        : t("orders.viewDetails")}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={detailsId}
                    className="border-t border-gray-100 bg-gray-50/40 px-4 py-4 sm:px-5"
                  >
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => {
                        const img = getProductImage(item);

                        return (
                          <div
                            key={`${order._id}-${idx}`}
                            className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4"
                          >
                            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-gray-50">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={item.productId.name}
                                  fill
                                  className="object-contain"
                                  sizes="112px"
                                />
                              ) : (
                                <div className="h-full w-full" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <Link
                                    href={`/products/${generateSlug(item.productId.name, item.productId?._id)}`}
                                    className="line-clamp-2 text-sm font-semibold text-gray-900 hover:underline"
                                  >
                                    {item.productId.name} {item.finaCode}
                                  </Link>

                                  {item.productId.code && (
                                    <p className="mt-1 text-xs wrap-break-word text-gray-500">
                                      {item.productId.code}
                                    </p>
                                  )}
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-sm text-gray-600">
                                    {item.quantity} × GEL {item.unitPrice}
                                  </p>
                                  <p className="text-sm font-bold text-gray-900">
                                    GEL {item.lineTotal}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <Pagination
              currentPage={clampedPage}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                if (isFetching) return;
                setExpanded({});
                setPage(Math.min(Math.max(1, nextPage), totalPages));
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
