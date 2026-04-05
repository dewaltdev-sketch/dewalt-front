"use client";

import ShieldIcon from "@/components/icons/shieldIcon";
import StockIcon from "@/components/icons/stockIcon";
import ShareButton from "@/components/ui/ShareButton";
import { useTranslations } from "next-intl";
import AddToCart from "../../cart/components/addToCart";
import { CompareButton } from "../../compare/components/compareButton";
import { Product } from "../../types";
import ProductRating from "../productRating";
import { useGetLocale } from "@/lib/utils/useGetLocale";

export default function ProductInfo({ product }: { product: Product }) {
  const t = useTranslations();
  const locale = useGetLocale();
  const {
    name,
    price,
    code,

    _id,
    rating,
    reviewCount,
    brandId,
    categoryId,
    finaCode,
    quantity,
    slug,
    originalPrice,
    orderOnly,
  } = product;

  return (
    <div className="m-auto w-full max-w-[410px] space-y-4 md:m-0 md:max-w-none">
      {/* Product Title */}
      <h1 className="text-dark-secondary-100 font-bpg-web-002-caps text-2xl md:text-2xl">
        {name}{" "}
        {finaCode && (
          <span className="text-dark-secondary-100 text-[28px] md:text-[28px]">
            {finaCode}
          </span>
        )}
      </h1>

      {/* Rating and Compare */}
      <div className="flex items-center gap-2 md:mb-6">
        <ProductRating
          productId={_id}
          initialRating={rating}
          initialReviewCount={reviewCount}
        />
      </div>

      {/* Price and Checkbox */}
      <div className="flex items-center gap-4 md:mb-6">
        <span className="text-dark-secondary-100 text-2xl">{price} GEL</span>
        {originalPrice && originalPrice > price ? (
          <span className="text-text-secondary text-xs line-through">
            {product.originalPrice} GEL
          </span>
        ) : null}
        <CompareButton productId={_id} />
      </div>

      {/* Product Details */}
      <div className="space-y-2 md:mb-6">
        <div className="text-dark-secondary-100 text-sm">
          <span className="text-text-secondary text-sm">
            {t("product.brand")}:{" "}
          </span>
          {brandId.name}
        </div>
        <div className="text-dark-secondary-100 text-sm">
          <span className="text-text-secondary text-sm">
            {t("product.productCode")}:{" "}
          </span>
          {finaCode || code}
        </div>
        <div className="text-dark-secondary-100 text-sm">
          <span className="text-text-secondary text-sm">
            {t("product.category")}:{" "}
          </span>
          {categoryId.name}
        </div>
      </div>

      {/* Quantity Selector and Add to Cart */}
      {!orderOnly ? <AddToCart product={product} /> : null}
      {orderOnly ? (
        <div className="text-dark-secondary-100 text-sm">
          {t("product.orderOnly")}
        </div>
      ) : null}

      {/* Additional Information */}
      <div className="border-line-color flex flex-wrap gap-2 space-y-3 border-t pt-4 md:gap-4">
        {quantity > 0 ? (
          <div className="flex h-8 items-center gap-2 rounded bg-[#E1EFE1] p-2 text-[#539653]">
            <StockIcon />
            <span className="text-sm">{t("product.inStock")}</span>
          </div>
        ) : (
          <div className="flex h-8 items-center gap-2 rounded bg-[#f1d5ce] p-2 text-[#ce1d26]">
            <StockIcon />
            <span className="text-sm">{t("product.outOfStock")}</span>
          </div>
        )}
        <div className="bg-background-secondary flex h-8 items-center gap-2 rounded p-2">
          <ShieldIcon />
          <span className="text-dark-secondary-100 text-sm">
            {t("product.warranty")}
          </span>
        </div>
        <ShareButton url={`/${locale}/products/${slug}-${_id}`} />
      </div>
    </div>
  );
}
