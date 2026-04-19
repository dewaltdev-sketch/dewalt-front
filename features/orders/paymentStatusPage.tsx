"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/ui/breadcrumb";
import Loading from "@/components/ui/loading";
import { Link } from "@/i18n/navigation";
import useGetOrderStatus from "./hooks/useGetOrderStatus";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useCartContext } from "@/features/products/cart/cartContext";

export default function PaymentStatusPage() {
  const t = useTranslations();
  const session = useSession();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { removeItem } = useCartContext();

  const { data, isLoading, isError } = useGetOrderStatus(orderId);
  const order = data?.order;
  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("paymentStatus.title") },
  ];

  // remove items from cart if order is paid
  useEffect(() => {
    if (order?.items && data?.status === "paid") {
      order?.items.forEach((item) => {
        removeItem(item.productId);
      });
    }
  }, [order, data?.status]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <Breadcrumb items={breadcrumbItems} />
        <Loading minHeight="60vh" message={t("paymentStatus.loading")} />
      </div>
    );
  }

  const hasError = isError || !orderId || !data?.status;
  const status = data?.status ?? "";
  const isPaid = status === "paid";
  const isFailed = status === "failed";
  const isPending = status === "pending";
  const isCancelled = status === "cancelled";

  const statusLabels: Record<string, string> = {
    paid: t("paymentStatus.paid"),
    shipped: t("paymentStatus.shipped"),
    delivered: t("paymentStatus.delivered"),
    failed: t("paymentStatus.failed"),
    pending: t("paymentStatus.pending"),
    cancelled: t("paymentStatus.cancelled"),
  };

  const displayStatusLabel = statusLabels[status] || t("paymentStatus.pending");

  const statusStyles = isPaid
    ? {
        wrapper: "bg-green-50 text-green-700 border-green-200",
        iconBg: "bg-green-600",
      }
    : isFailed
      ? {
          wrapper: "bg-red-50 text-red-700 border-red-200",
          iconBg: "bg-red-600",
        }
      : isCancelled
        ? {
            wrapper: "bg-red-50 text-red-700 border-red-200",
            iconBg: "bg-red-600",
          }
        : {
            wrapper: "bg-amber-50 text-amber-700 border-amber-200",
            iconBg: "bg-amber-500",
          };

  const deliveryTypeLabel =
    order?.deliveryType === "tbilisi"
      ? t("paymentStatus.deliveryType.tbilisi")
      : t("paymentStatus.deliveryType.region");

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="customContainer min-h-[60vh] px-5 py-10 text-center lg:px-0">
        <h1 className="text-dark-secondary-100 text-2xl font-semibold">
          {isPaid ? t("paymentStatus.successTitle") : t("paymentStatus.title")}
        </h1>
        {hasError ? (
          <p className="text-text-secondary mt-3">{t("paymentStatus.error")}</p>
        ) : (
          <>
            {(isPending || isFailed) && (
              <p className="text-text-secondary mt-3">
                items
                {t("paymentStatus.description")}
              </p>
            )}
            {isPaid && (
              <p className="text-text-secondary mt-3">
                {t("paymentStatus.successMessage")}
              </p>
            )}
            <div
              className={`mt-6 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold ${statusStyles.wrapper}`}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${statusStyles.iconBg}`}
              >
                {isFailed ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12" />
                    <path d="M18 6l-12 12" />
                  </svg>
                ) : isPaid ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : isCancelled ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                    aria-hidden="true"
                  >
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                )}
              </span>
              <span>{displayStatusLabel}</span>
            </div>

            {order && (
              <div className="mx-auto mt-8 w-full max-w-3xl rounded-xl border bg-white p-5 text-left shadow-sm sm:p-6">
                <h2 className="text-dark-secondary-100 text-lg font-semibold sm:text-xl">
                  {t("paymentStatus.detailsTitle")}
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.orderCode")}
                    </p>
                    <p className="text-sm font-semibold break-all text-gray-900">
                      {order.uuid || t("paymentStatus.notAvailable")}
                    </p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.orderId")}
                    </p>
                    <p className="text-sm font-semibold break-all text-gray-900">
                      {order._id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.customer")}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.name} {order.surname}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.phone")}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.phone}
                    </p>
                  </div>
                  <div className="rounded-md border p-3 sm:col-span-2">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.address")}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.address}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.delivery")}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {deliveryTypeLabel}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-xs text-gray-500">
                      {t("paymentStatus.orderDate")}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {moment(order.createdAt).format("DD.MM.YYYY HH:mm")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {t("paymentStatus.subtotal")}
                    </span>
                    <span className="font-medium text-gray-900">
                      GEL {order.subtotal}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {t("paymentStatus.deliveryPrice")}
                    </span>
                    <span className="font-medium text-gray-900">
                      GEL {order.deliveryPrice}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {t("paymentStatus.total")}
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      GEL {order.total}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="bg-primary text-dark-secondary-100 rounded-md px-5 py-2 text-sm font-semibold transition-colors hover:opacity-90"
          >
            {t("paymentStatus.goHome")}
          </Link>
          {session.data?.user && (
            <Link
              href="/profile/orders"
              className="border-primary text-primary hover:bg-primary/10 rounded-md border px-5 py-2 text-sm font-semibold transition-colors"
            >
              {t("paymentStatus.viewOrders")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
