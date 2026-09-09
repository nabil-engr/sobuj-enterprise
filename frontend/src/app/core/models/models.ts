// ============================================================================
// Sobuj Enterprise - Frontend Core Domain Models & Contracts
// ============================================================================

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
}

export interface UserAddress {
  id: number;
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  area?: string;
  isDefault: boolean;
}

export interface AuthResponse {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
}

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
  displayType: 'Checkbox' | 'Dropdown' | 'ColorSwatch';
  displayOrder: number;
  values: FilterAttributeValue[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface CreateOrderDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  area?: string;
  paymentMethod?: string;
  orderType?: string;
  customerNote?: string;
  items: {
    productId: number;
    variantName?: string;
    quantity: number;
  }[];
}

export interface OrderResponseDto {
  orderId: number;
  orderNumber: string;
  subTotal: number;
  deliveryFee: number;
  totalAmount: number;
  whatsAppOrderUrl: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  area?: string;
  deliveryFee: number;
  subTotal: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderType: string;
  customerNote?: string;
  adminNote?: string;
  createdAt: string;
  items: {
    id: number;
    productId: number;
    productTitle: string;
    productSKU: string;
    variantName?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
}

export interface PagedResult<T> {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}
