export interface Product {
  id: number;
  title: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  categoryId: number;
  category?: Category;
  brandId?: number;
  brand?: Brand;
  primaryImageUrl: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  tags?: string;
  wholesaleTiersJson?: string;
  variants?: ProductVariant[];
  galleryImages?: { id: number; imageUrl: string; displayOrder: number }[];
}
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
}
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  isFeatured: boolean;
}
export interface ProductVariant {
  id: number;
  productId: number;
  variantName: string;
  sku: string;
  priceAdjustment: number;
  stockQuantity: number;
}
export interface FilterAttributeValue {
  id: number;
  filterAttributeId: number;
  value: string;
  colorHex?: string;
  displayOrder: number;
}
export interface FilterAttribute {
  id: number;
  name: string;
  code: string;
  categoryId?: number;
  displayType: "Checkbox" | "Dropdown" | "ColorSwatch";
  displayOrder: number;
  values: FilterAttributeValue[];
}
