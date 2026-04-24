import type { DeliveryType } from "@/features/orders/types";
import type { DeliveryInformation } from "../types";

export type DeliveryUi = {
  basePrice: number;
  freeOver?: number;
  freeEnabled: boolean;
  isAvailable: boolean;
  isFreeEligible: boolean;
  effectivePrice: number;
};

export function getAvailableDeliveryTypes(
  deliveryInformation?: DeliveryInformation | null
): DeliveryType[] {
  const types: DeliveryType[] = ["tbilisi", "region", "officePickup"];
  return types.filter((type) => {
    if (type === "officePickup") return true;
    const price = deliveryInformation?.[type]?.price ?? 0;
    return typeof price === "number" && price > 0;
  });
}

export function getDeliveryPrice({
  type,
  deliveryInformation,
  subtotal,
}: {
  type: DeliveryType;
  deliveryInformation?: DeliveryInformation | null;
  subtotal: number;
}) {
  return getDeliveryUi({ type, deliveryInformation, subtotal }).effectivePrice;
}

export function getDeliveryUi({
  type,
  deliveryInformation,
  subtotal,
}: {
  type: DeliveryType;
  deliveryInformation?: DeliveryInformation | null;
  subtotal: number;
}): DeliveryUi {
  const info = deliveryInformation?.[type];
  const basePrice = info?.price ?? 0;
  const freeOver = info?.freeOver;
  const freeEnabled = info?.freeEnabled ?? true;
  const isOfficePickup = type === "officePickup";

  const isAvailable =
    isOfficePickup || (typeof basePrice === "number" && basePrice > 0);
  const isFreeEligible =
    !isOfficePickup &&
    isAvailable &&
    freeEnabled &&
    typeof freeOver === "number" &&
    freeOver > 0 &&
    subtotal >= freeOver;

  return {
    basePrice,
    freeOver,
    freeEnabled,
    isAvailable,
    isFreeEligible,
    effectivePrice: isFreeEligible ? 0 : basePrice,
  };
}

