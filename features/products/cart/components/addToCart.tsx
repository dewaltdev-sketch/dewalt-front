"use client";

import { Button } from "@/components/ui/button";
import { Product } from "../../types";
import { useCartContext } from "../cartContext";
import { BucketIcon } from "@/components/icons/bucketIcon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function AddToCart({ product }: { product: Product }) {
  const t = useTranslations();
  const { addItem } = useCartContext();
  const maxQuantity = product.quantity || 0;

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(t("cart.addedToCart"), {
      style: {
        background: "#FFBA00",
        color: "#1A1A1A",
        border: "1px solid #E5A500",
      },
      duration: 1000,
    });
  };

  return (
    <Button
      size="md"
      className="w-full flex-1 sm:flex-initial md:w-auto"
      disabled={maxQuantity === 0}
      onClick={handleAddToCart}
    >
      <BucketIcon className="h-6 w-6" />
      <span>{t("cart.addToCart")}</span>
    </Button>
  );
}

export const AddSingleItemToCart = ({
  product,
  size = "md",
}: {
  product: Product;
  size: "sm" | "md";
}) => {
  const t = useTranslations();
  const { addItem, items } = useCartContext();
  const productInCart = items.find((item) => item.product._id === product._id);
  const productInCartQuantity = productInCart?.quantity || 0;
  const handleClick = () => {
    if (!product.quantity || productInCartQuantity >= product.quantity) {
      toast.warning(t("cart.outOfStock"), {
        duration: 3000,
      });
      return;
    }

    addItem(product, 1);
    toast.success(t("cart.addedToCart"), {
      style: {
        background: "#FFBA00",
        color: "#1A1A1A",
        border: "1px solid #E5A500",
      },
      duration: 1000,
    });
  };
  return (
    <button
      type="button"
      className={cn(
        "bg-primary hover:bg-primary/90 text-dark-secondary-100 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all hover:scale-103 xl:max-w-[98px]",
        {
          "xl:max-w-[98px]": size === "md",
          "xl:max-w-full": size === "sm",
        }
      )}
      onClick={handleClick}
    >
      <BucketIcon
        className={cn("text-dark-secondary-100", {
          "xl:hidden": size === "md",
        })}
      />
      <span className={"hidden lg:inline"}>{t("cart.add")}</span>
      <span className="xl:hidden">{t("cart.toCart")}</span>
    </button>
  );
};
