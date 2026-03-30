import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "../../types";
import { cn } from "@/lib/utils";
import { CompareButton } from "@/features/products/compare/components/compareButton";
import { AddSingleItemToCart } from "../../cart/components/addToCart";
import { generateSlug } from "@/lib/utils/slugify";
import ProductDescription from "./productDescription";

export default function ProductCard({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: "sm" | "md";
  className?: string;
}) {
  const {
    image,
    name,
    code,
    description,
    price,
    originalPrice,
    discount,
    _id,
  } = product;

  return (
    <div
      className={cn(
        "relative min-w-0 flex-[0_0_calc(66.666%-0.5rem)] px-2 md:min-w-[240px] md:flex-[0_0_calc(25%)]",
        {
          "md:min-w-[240px]": size === "sm",
        },
        className
      )}
    >
      <div className="border-line-color relative flex h-full flex-col rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md md:p-4">
        {/* Discount Badge */}
        {discount ? (
          <div className="bg-discount-BG text-discount-text absolute top-2 left-2 z-10 rounded px-1 py-2 text-xs font-normal">
            {discount}%
          </div>
        ) : null}

        {/* Compare Checkbox */}
        <div className="absolute top-[165px] right-4 z-10 md:top-[170px] md:right-5">
          <CompareButton productId={_id} />
        </div>

        {/* Product Image */}
        <Link href={`/products/${generateSlug(name, _id)}`} className="block">
          <div className="relative mb-3 aspect-square h-[190px] w-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain transition-transform hover:scale-105"
              sizes="(max-width: 768px) 66.666vw, 25vw"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col">
          <Link
            href={`/products/${generateSlug(name, _id)}`}
            className={cn(
              "text-dark-secondary-100 hover:text-primary mb-2 [display:-webkit-box] h-10.5 overflow-hidden text-sm wrap-break-word text-ellipsis transition-colors [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:h-11.5 md:text-base",
              {
                "md:h-9.5 md:text-sm md:font-bold": size === "sm",
              }
            )}
            title={`${"product"} ${code}`}
          >
            <span dangerouslySetInnerHTML={{ __html: name }}></span> {code}
          </Link>
          <ProductDescription description={description} />

          {/* Price */}
          <div
            className={cn({
              "mt-auto items-center md:flex xl:flex xl:items-center xl:justify-between":
                size === "md",
              "mt-auto": size === "sm",
            })}
          >
            <div
              className={cn("mb-2 flex items-center gap-2 md:mb-0", {
                "md:mb-4": size === "sm",
              })}
            >
              <span className="text-dark-secondary-100">{price} GEL</span>
              {originalPrice && originalPrice > price ? (
                <span className="text-text-secondary text-xs line-through">
                  {product.originalPrice} GEL
                </span>
              ) : null}
            </div>

            {/* Add to Cart Button */}
            <AddSingleItemToCart product={product} size={size} />
          </div>
        </div>
      </div>
    </div>
  );
}
