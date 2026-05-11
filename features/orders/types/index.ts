export type DeliveryType = "tbilisi" | "region" | "officePickup";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  name: string;
  surname: string;
  email: string;
  personalId: string;
  phone: string;
  address: string;
  deliveryType: DeliveryType;
  items: CreateOrderItemPayload[];
  userId?: string;
}

export interface OrderDetails {
  _id: string;
  uuid: string;
  name: string;
  surname: string;
  email: string;
  personalId: string;
  phone: string;
  address: string;
  deliveryType: DeliveryType;
  deliveryPrice: number;
  subtotal: number;
  total: number;
  status: "pending" | "failed" | "paid" | "shipped" | "delivered";
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface OrderResponse {
  _id: string;
  status: "pending" | "failed" | "paid" | "shipped" | "delivered";
  total: number;
}

export interface CreatePaymentResponse {
  response?: {
    url?: string;
    checkout_url: string;
  };
}

export interface CreateTbcInstalmentResponse {
  orderId: string;
  orderUuid: string;
  amount: number;
  currency: "GEL";
  sessionId: string;
  redirectUrl: string;
  status: string;
}

export interface OrderDetailsWithItems extends OrderDetails {
  items: { productId: string; quantity: number }[];
}
export interface OrderStatusResponse {
  status: "pending" | "failed" | "paid" | "shipped" | "delivered" | "cancelled";
  order: OrderDetailsWithItems;
}

export type LocalizedText = {
  ka: string;
  en: string;
};

export interface OrderProductRef {
  _id: string;
  name: string;
  code: string;
  image: string;
  slug: string;
}

export interface OrderItemDetails {
  productId: OrderProductRef;
  quantity: number;
  total: number;
  unitPrice: number;
  lineTotal: number;
  address: string;
  deliveryType: "region" | "tbilisi" | "officePickup";
  name: string;
  personalId: string;
  phone: string;
  surname: string;
  finaCode?: string;
}

export interface UserOrder extends OrderDetails {
  items: OrderItemDetails[];
}

export interface PaginatedOrdersResponse {
  data: UserOrder[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
