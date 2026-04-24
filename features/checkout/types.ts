import type { DeliveryType } from "@/features/orders/types";

export type DeliveryInformation = Record<
  DeliveryType,
  {
    price: number;
    freeOver?: number;
    freeEnabled?: boolean;
  }
>;

