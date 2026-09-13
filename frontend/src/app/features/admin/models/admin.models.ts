import { Brand, Category, FilterAttribute, Product } from '../../../core/models';

export interface AdminUser { id: number; fullName: string; email: string; phoneNumber?: string; role: 'Admin' | 'Customer'; createdAt: string; }
export interface WhatsAppTemplate { id: number; title: string; templateType: string; messageFormat: string; isDefault: boolean; }
export interface ProductDraft extends Partial<Product> { title: string; slug: string; sku: string; price: number; discountPrice?: number | null; stockQuantity: number; categoryId: number; primaryImageUrl: string; }
export interface SimpleDraft { id: number; name: string; slug: string; description: string; displayOrder: number; isFeatured: boolean; categoryId: number | null; displayType: 'Checkbox' | 'Dropdown' | 'ColorSwatch'; code?: string; }
export interface AdminMenuItem { key: 'overview'|'orders'|'products'|'categories'|'brands'|'filters'|'templates'|'users'|'settings'; label: string; icon: string; count?: number; }
export interface AdminListItem { id: number; name: string; slug?: string; code?: string; displayType?: string; categoryId?: number | null; isFeatured?: boolean; description?: string; displayOrder?: number; }
export type { Brand, Category, FilterAttribute };
