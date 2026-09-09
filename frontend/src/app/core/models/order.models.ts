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
  items: { productId: number; variantName?: string; quantity: number }[];
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
