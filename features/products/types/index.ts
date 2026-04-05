export interface ProductSpec {
  label: string;
  value: string | number;
}

// Product interface matches ProductApi structure
// Backend returns localized strings when language parameter is provided
export interface Product {
  _id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  orderOnly?: boolean;
  inStock: boolean;
  quantity: number;
  rating: number;
  reviewCount: number;
  slug: string;
  brandId: { _id: string; name: string; slug: string };
  categoryId: { _id: string; name: string; slug: string };
  childCategoryId?: { _id: string; name: string; slug: string };
  specs: ProductSpec[];
  createdAt?: string;
  updatedAt?: string;
  finaId?: number;
  finaCode?: string;
}
