import { Injectable, signal } from '@angular/core';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'sobuj_cart_v1';
  private items = signal<CartItem[]>(this.restore());
  public cartItems = this.items.asReadonly();
  public isDrawerOpen = signal<boolean>(false);

  public addToCart(product: Product, quantity = 1, selectedVariant?: string) {
    const current = [...this.items()];
    const existing = current.find(i => i.product.id === product.id && i.selectedVariant === selectedVariant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({ product, quantity, selectedVariant });
    }
    this.items.set(current);
    this.persist();
    this.isDrawerOpen.set(true);
  }

  public removeFromCart(productId: number, variant?: string) {
    this.items.set(this.items().filter(i => !(i.product.id === productId && i.selectedVariant === variant)));
    this.persist();
  }

  public updateQuantity(productId: number, quantity: number, variant?: string) {
    const current = [...this.items()];
    const target = current.find(i => i.product.id === productId && i.selectedVariant === variant);
    if (target) {
      target.quantity = Math.max(1, quantity);
      this.items.set(current);
      this.persist();
    }
  }

  public get subTotal(): number {
    return this.items().reduce((acc, item) => acc + this.getUnitPrice(item.product, item.quantity) * item.quantity, 0);
  }

  public getUnitPrice(product: Product, quantity: number): number {
    const retail = product.discountPrice ?? product.price;
    try {
      const tiers = JSON.parse(product.wholesaleTiersJson || '[]') as { minQuantity: number; unitPrice: number }[];
      return tiers.filter(t => t.minQuantity > 0 && t.minQuantity <= quantity && t.unitPrice > 0)
        .sort((a, b) => b.minQuantity - a.minQuantity)[0]?.unitPrice ?? retail;
    } catch { return retail; }
  }

  public get totalItemsCount(): number {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  }

  public clear() {
    this.items.set([]);
    this.persist();
  }

  private restore(): CartItem[] {
    try {
      const value = localStorage.getItem(this.storageKey);
      return value ? JSON.parse(value) as CartItem[] : [];
    } catch { return []; }
  }

  private persist(): void {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.items())); } catch { /* storage is optional */ }
  }
}
