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
