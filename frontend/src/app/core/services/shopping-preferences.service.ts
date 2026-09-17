import { Injectable, signal } from "@angular/core";
import { Product } from "../models";

@Injectable({ providedIn: "root" })
export class ShoppingPreferencesService {
  private readonly wishlistKey = "sobuj_wishlist_v1";
  private readonly compareKey = "sobuj_compare_v1";
  private readonly recentKey = "sobuj_recent_v1";

  readonly wishlist = signal<Product[]>(this.read(this.wishlistKey));
  readonly compare = signal<Product[]>(this.read(this.compareKey));
  readonly recentlyViewed = signal<Product[]>(this.read(this.recentKey));

  toggleWishlist(product: Product): void {
    const next = this.wishlist().some((p) => p.id === product.id)
      ? this.wishlist().filter((p) => p.id !== product.id)
      : [product, ...this.wishlist()].slice(0, 50);
    this.wishlist.set(next);
    this.write(this.wishlistKey, next);
  }

  isWishlisted(id: number): boolean {
    return this.wishlist().some((p) => p.id === id);
  }

  toggleCompare(product: Product): void {
    const exists = this.compare().some((p) => p.id === product.id);
    const next = exists
      ? this.compare().filter((p) => p.id !== product.id)
      : [...this.compare(), product].slice(-4);
    this.compare.set(next);
    this.write(this.compareKey, next);
  }

  isCompared(id: number): boolean {
    return this.compare().some((p) => p.id === id);
  }

  remember(product: Product): void {
    const next = [
      product,
      ...this.recentlyViewed().filter((p) => p.id !== product.id),
    ].slice(0, 12);
    this.recentlyViewed.set(next);
    this.write(this.recentKey, next);
  }

  private read(key: string): Product[] {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]") as Product[];
    } catch {
      return [];
    }
  }

  private write(key: string, value: Product[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage is optional */
    }
  }
}
