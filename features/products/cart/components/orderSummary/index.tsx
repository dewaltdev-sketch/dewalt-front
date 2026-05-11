"use client";

import { Button } from "@/components/ui/button";
import { useCartContext } from "../../cartContext";
import { useTranslations } from "next-intl";
import PayIcon from "@/components/icons/payIcon";
import { useRouter } from "@/i18n/navigation";

export default function OrderSummary() {
  const t = useTranslations();
  const router = useRouter();
  const { getSelectedItems, isLoading } = useCartContext();
  const selectedItems = getSelectedItems();
  const totalItems = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = selectedItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="border-line-color rounded-lg border bg-white p-4 md:p-6">
      <h3 className="text-dark-secondary-100 mb-4 text-sm">
        {t("cart.orderDetails")}
      </h3>

      <div className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary-100 text-xs">
            {t("cart.itemsCount")}
          </span>
          <span className="text-dark-secondary-100 text-xs">{totalItems}</span>
        </div>
      </div>

      <div className="">
        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 md:pb-6">
          <span className="text-dark-secondary-100 text-sm font-semibold md:text-sm">
            {t("cart.total")}
          </span>
          <span className="text-dark-secondary-100 text-sm font-semibold md:text-sm">
            {totalPrice.toLocaleString("ka-GE")} GEL
          </span>
        </div>

        <Button
          variant="default"
          size="md"
          className="bg-primary hover:bg-primary/90 text-dark-secondary-100 w-full"
          disabled={selectedItems.length === 0 || isLoading}
          onClick={() => router.push("/checkout")}
        >
          <PayIcon />
          <span>{t("cart.buy")}</span>
        </Button>
      </div>
    </div>
  );
}
