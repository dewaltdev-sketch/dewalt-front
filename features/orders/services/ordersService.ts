import { API_ROUTES } from "@/lib/apiRoutes";
import { createApiClient } from "@/lib/apiClient";
import type {
  CreateOrderPayload,
  CreatePaymentResponse,
  CreateTbcInstalmentResponse,
  OrderResponse,
  OrderStatusResponse,
  PaginatedOrdersResponse,
} from "../types";

const ordersClient = createApiClient<OrderResponse>(API_ROUTES.ORDERS);
const tbcInstalmentClient = createApiClient<CreateTbcInstalmentResponse>(
  API_ROUTES.TBC_INSTALMENT
);

export const ordersService = {
  create: (payload: CreateOrderPayload) =>
    ordersClient.post<CreateOrderPayload, OrderResponse>(payload),
  createPayment: (orderId: string) =>
    ordersClient.post<{ orderId: string }, CreatePaymentResponse>(
      { orderId },
      undefined,
      { url: `${API_ROUTES.ORDERS}/payment` }
    ),
  createTbcInstalment: (orderId: string) =>
    tbcInstalmentClient.post<{ orderId: string }, CreateTbcInstalmentResponse>(
      { orderId },
      undefined,
      { url: `${API_ROUTES.TBC_INSTALMENT}/orders` }
    ),
  checkStatus: (orderId: string) =>
    ordersClient.get<OrderStatusResponse>({ orderId }, "status"),
  getMyOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    ordersClient.get<PaginatedOrdersResponse>(
      {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        status: params?.status,
      },
      "my"
    ),
};
