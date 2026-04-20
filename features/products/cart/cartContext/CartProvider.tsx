"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from ".";
import type { CartContextType, StoredCartItem } from "../types";
import type { Product } from "../../types";
import { useGetProductsByIds } from "../../hooks/useGetProductsByIds";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storedItems, setStoredItems] = useState<StoredCartItem[]>([]);
  const [isLoadingLocalStorage, setIsLoadingLocalStorage] =
    useState<boolean>(true);
  const isInitialized = useRef(false);

  const finalizeLocalStorageInit = (nextItems: StoredCartItem[] = []) => {
    queueMicrotask(() => {
      setStoredItems(nextItems);
      setIsLoadingLocalStorage(false);
      isInitialized.current = true;
    });
  };

  // Load from localStorage on client side only
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized.current) {
      const cartItems = localStorage.getItem("cartItems");
      if (cartItems) {
        try {
          const parsed = JSON.parse(cartItems);
          const normalized: StoredCartItem[] = Array.isArray(parsed)
            ? parsed
                .map((item: unknown): StoredCartItem | null => {
                  if (
                    item &&
                    typeof item === "object" &&
                    "productId" in item
                  ) {
                    const storedItem = item as StoredCartItem;
                    return {
                      productId: String(storedItem.productId),
                      quantity: Number(storedItem.quantity) || 1,
                      selected: storedItem.selected ?? true,
                    };
                  }

                  return null;
                })
                .filter((item): item is StoredCartItem => item !== null)
            : [];

          finalizeLocalStorageInit(normalized);
        } catch (error) {
          console.error("Failed to parse cartItems from localStorage", error);
          finalizeLocalStorageInit([]);
        }
      } else {
        finalizeLocalStorageInit([]);
      }
    }
  }, []);

  // Sync to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(storedItems));
    }
  }, [storedItems]);

  const productIds = useMemo(
    () => storedItems.map((item) => item.productId),
    [storedItems]
  );

  const { products, isLoading } = useGetProductsByIds(productIds);

  const productsById = useMemo(() => {
    return new Map(products.map((product) => [product._id, product]));
  }, [products]);

  const items = useMemo(() => {
    return storedItems
      .map((item) => {
        const product = productsById.get(item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          selected: item.selected ?? true,
        };
      })
      .filter(Boolean) as {
      product: Product;
      quantity: number;
      selected: boolean;
    }[];
  }, [storedItems, productsById]);

  const addItem = (product: Product, quantity: number = 1) => {
    setStoredItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product._id, quantity, selected: true }];
    });
  };

  const removeItem = (productId: string) => {
    setStoredItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setStoredItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSelect = (productId: string) => {
    setStoredItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected =
      storedItems.length > 0 && storedItems.every((item) => item.selected);
    setStoredItems((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const removeSelected = () => {
    setStoredItems((prev) => prev.filter((item) => !item.selected));
  };

  const clearCart = () => {
    setStoredItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getSelectedItems = () => {
    return items.filter((item) => item.selected);
  };

  const value: CartContextType = {
    items,
    isLoading: isLoading || isLoadingLocalStorage,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    removeSelected,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getSelectedItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
