import type { Product } from "../../types";

export interface CartItem {
  product: Product;
  quantity: number;
  selected?: boolean;
}

export interface StoredCartItem {
  productId: string;
  quantity: number;
  selected?: boolean;
}

export interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelect: (productId: string) => void;
  toggleSelectAll: () => void;
  removeSelected: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSelectedItems: () => CartItem[];
}
