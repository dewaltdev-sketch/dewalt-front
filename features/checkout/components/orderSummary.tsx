import { useTranslations } from "next-intl";

type OrderSummaryProps = {
  totalItems: number;
  subtotal: number;
  deliveryPrice: number;
  totalPrice: number;
  buttonsGroup: React.ReactNode;
};
export default function OrderSummary({
  totalItems,
  subtotal,
  deliveryPrice,
  totalPrice,
  buttonsGroup,
}: OrderSummaryProps) {
  const t = useTranslations();
  return (
    <div className="lg:sticky lg:top-4 lg:h-fit">
      <div className="border-line-color rounded-lg border bg-white p-4 md:p-6">
        <h3 className="text-dark-secondary-100 mb-4 text-sm">
          {t("checkout.summaryTitle")}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              {t("checkout.itemsCount")}
            </span>
            <span className="text-dark-secondary-100">{totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              {t("checkout.subtotal")}
            </span>
            <span className="text-dark-secondary-100">
              {subtotal.toLocaleString("ka-GE")} GEL
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">
              {t("checkout.deliveryPrice")}
            </span>
            <span className="text-dark-secondary-100">
              {deliveryPrice.toLocaleString("ka-GE")} GEL
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm font-semibold">
          <span className="text-dark-secondary-100">{t("checkout.total")}</span>
          <span className="text-dark-secondary-100">
            {totalPrice.toLocaleString("ka-GE")} GEL
          </span>
        </div>
      </div>

      <div className="mt-4 box-border">
        <div className="border-line-color rounded-lg border bg-white p-4 md:p-6">
          <h3 className="text-dark-secondary-100 mb-4 text-sm">
            {t("checkout.instalmentPayment")}
          </h3>
          {buttonsGroup}
        </div>
      </div>
    </div>
  );
}
