import { Product } from "./catalog.models";
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
