"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import TrashIcon from "@/components/icons/trashIcon";
import type { CartItem as CartItemType } from "../../types";
import { useCartContext } from "../../cartContext";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils/slugify";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const t = useTranslations();
  const { product, quantity, selected } = item;
  const { toggleSelect, updateQuantity, removeItem } = useCartContext();

  const handleQuantityChange = (data: number) => {
    if (!product.quantity || quantity + data > product.quantity) {
      toast.warning(t("cart.outOfStock"), {
        duration: 3000,
      });
      return;
    }
    updateQuantity(product._id, quantity + data);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      updateQuantity(product._id, value);
    } else if (e.target.value === "") {
      updateQuantity(product._id, 1);
    }
  };

  return (
    <div className="border-line-color flex gap-4 border-b pt-4 pb-4 last:border-0 md:py-6">
      {/* Checkbox */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 flex items-start pt-2">
          <Checkbox
            checked={selected}
            onChange={() => toggleSelect(product._id)}
          />
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${generateSlug(product.name, product._id)}`}
          className="shrink-0"
        >
          <div className="relative h-24 w-24 overflow-hidden rounded-lg md:h-40 md:w-40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 96px, 160px"
            />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-2 md:flex-col md:items-start md:justify-between md:py-2">
        <div className="w-full flex-1 md:flex md:flex-row md:justify-between">
          <Link
            href={`/products/${generateSlug(product.name, product._id)}`}
            className="text-dark-secondary-100 hover:text-primary mb-1 block text-sm font-bold transition-colors md:max-w-[200px] md:text-sm"
          >
            {product.name} {product.finaCode || product.code}
          </Link>

          {/* Price */}
          <div className="flex items-center gap-2 md:flex-col">
            <span className="text-dark-secondary-100 text-sm font-bold md:text-sm">
              {product.price} GEL
            </span>
            {product.originalPrice && (
              <span className="text-text-secondary text-xs line-through">
                {product.originalPrice} GEL
              </span>
            )}
          </div>
        </div>

        {/* Quantity and Delete */}
        <div className="flex items-center justify-between gap-4 md:w-full">
          {/* Quantity Selector */}

          <div className="border-line-color flex items-center rounded border">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="h-8 px-2 hover:bg-gray-50 md:h-10 md:px-3"
              aria-label="Decrease quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8H12"
                  stroke="#1A1A1A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityInput}
              className="w-12 border-0 text-center text-sm focus:ring-0 focus:outline-none md:w-16"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="h-8 px-2 hover:bg-gray-50 md:h-10 md:px-3"
              aria-label="Increase quantity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4V12M4 8H12"
                  stroke="#1A1A1A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Delete Button */}

          <Button
            variant="outline"
            aria-label="Delete item"
            size="sm"
            onClick={() => removeItem(product._id)}
            className="text-text-secondary bg-background-secondary border-line-color hover:text-dark-secondary-100 flex h-8 items-center gap-2 rounded border p-2 text-xs"
          >
            <TrashIcon className="text-text-secondary" />
            <span className="text-xs">{t("cart.delete")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
