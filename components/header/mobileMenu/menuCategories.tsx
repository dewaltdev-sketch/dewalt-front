import { useState } from "react";
import MenuItem, { MenuSubItem } from "../menu/menuItm";
import SubCategorySelector from "./subCategorySelector";
import { MenuBrand } from "@/features/categories/types";

export default function MenuCategories({
  category,
  onClose,
  onchangeCategory,
  brands,
}: {
  category: number;
  onClose: () => void;
  onchangeCategory: (category: number | null) => void;
  brands: MenuBrand[];
}) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );

  const handleClose = (isSubCategory?: boolean) => {
    if (selectedSubCategory !== null) {
      setSelectedSubCategory(null);
    } else {
      if (isSubCategory) {
        onClose();
      }
      onchangeCategory(null);
    }
  };

  const selectedCategory = brands?.[category];

  const handleCategoryChange = (newCategoryIndex: number) => {
    if (newCategoryIndex !== category) {
      onchangeCategory(newCategoryIndex);
      setSelectedSubCategory(null);
    }
  };

  const brandSlug = selectedCategory?.slug;
  const categorySlug =
    selectedSubCategory !== null
      ? selectedCategory?.categories?.[selectedSubCategory]?.slug
      : undefined;

  return (
    <div>
      <div className="bg-background mb-4 flex items-center gap-4 pl-5">
        <button
          className="flex cursor-pointer items-center gap-2 text-[12px] transition-opacity hover:opacity-70"
          onClick={() => handleClose(false)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.5 4L6.28478 7.29293C5.90507 7.68182 5.90507 8.31818 6.28478 8.70707L9.5 12"
              stroke="#9A9A9A"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          უკან
        </button>

        {/* Custom Select Dropdown */}
        <SubCategorySelector
          brands={brands}
          selectedCategory={category}
          onchangeCategory={handleCategoryChange}
        />
      </div>
      <div>
        {selectedSubCategory === null && (
          <ul className="ml-1 flex flex-col gap-2">
            {selectedCategory?.categories.map((menuCategory, index) => (
              <MenuSubItem
                key={index}
                onClick={() => setSelectedSubCategory(index)}
                parentId={selectedCategory?.name || ""}
                id={index.toString()}
                displayName={menuCategory.name}
                hasSubCategories={menuCategory.subCategories.length > 0}
                isActive={false}
                slug={menuCategory.slug}
                brandSlug={brandSlug || ""}
                closeMenu={() => handleClose(true)}
              />
            ))}
          </ul>
        )}
        {selectedSubCategory !== null && (
          <ul className="ml-5 flex flex-col gap-2">
            {brands?.[category].categories[
              selectedSubCategory
            ].subCategories.map((subCategory, index) => (
              <MenuItem
                key={index}
                label={subCategory.name}
                href={`/products?category=${categorySlug}&brand=${brandSlug}&childCategory=${subCategory.slug}`}
                onClick={() => {
                  onClose();
                  onchangeCategory(null);
                  setSelectedSubCategory(null);
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
