"use client";

import type { ChangeEventHandler } from "react";
import { useTranslations } from "next-intl";
import type { DeliveryType } from "@/features/orders/types";
import type { DeliveryInformation } from "../../types";
import { getDeliveryUi } from "../../utils/delivery";

type Props = {
  deliveryInformation?: DeliveryInformation | null;
  subtotal: number;
  value: DeliveryType;
  onChange: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  locale?: string;
  className?: string;
  availableDeliveryTypes: DeliveryType[];
};

export default function OrderDeliveryOptions({
  deliveryInformation,
  subtotal,
  value,
  onChange,
  name = "deliveryType",
  className,
  availableDeliveryTypes,
}: Props) {
  const t = useTranslations();

  if (!availableDeliveryTypes?.length) return null;

  const rootClassName = ["mt-6", className].filter(Boolean).join(" ");

  const renderOption = (type: DeliveryType) => {
    const ui = getDeliveryUi({ type, deliveryInformation, subtotal });
    const title =
      type === "tbilisi"
        ? t("checkout.deliveryTbilisi")
        : type === "region"
          ? t("checkout.deliveryRegion")
          : t("checkout.deliveryOfficePickup");

    return (
      <label
        key={type}
        className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm ${
          ui.isFreeEligible ? "border-green-300 bg-green-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={type}
            checked={value === type}
            onChange={onChange}
          />
          <span>{title}</span>
        </div>

        <span className="text-right text-xs">
          {ui.isFreeEligible ? (
            <>
              <span className="inline-flex items-center rounded-full bg-green-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                {t("checkout.free")}
              </span>
              {ui.freeEnabled && typeof ui.freeOver === "number" ? (
                <span className="text-text-secondary mt-1 block">
                  {t("checkout.minDynamic", { amount: ui.freeOver })}
                </span>
              ) : null}
            </>
          ) : (
            <>
              <span className="text-text-secondary block">
                {type === "officePickup" ? "0 GEL" : `+${ui.basePrice} GEL`}
              </span>
              {type !== "officePickup" &&
              ui.freeEnabled &&
              typeof ui.freeOver === "number" ? (
                <span className="text-text-secondary mt-1 block">
                  {t("checkout.freeOverDynamic", { amount: ui.freeOver })}
                </span>
              ) : null}
            </>
          )}
        </span>
      </label>
    );
  };

  return (
    <div className={rootClassName}>
      <p className="text-dark-secondary-100 mb-3 text-sm font-semibold">
        {t("checkout.deliveryTitle")}
      </p>
      <div className="space-y-3">
        {availableDeliveryTypes.map((type) => renderOption(type))}
      </div>
    </div>
  );
}
