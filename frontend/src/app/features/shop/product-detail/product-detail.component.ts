// ============================================================================
// Sobuj Enterprise - Product Detail Component (Faithful Stitch Design)
// ============================================================================

import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../../core/services/product.service";
import { CartService } from "../../../core/services/cart.service";
import { ShoppingPreferencesService } from "../../../core/services/shopping-preferences.service";
import {
  EngagementService,
  ProductReview,
} from "../../../core/services/engagement.service";
import { Product } from "../../../core/models";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./product-detail.component.html",
  styleUrl: "./product-detail.component.css",
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  preferences = inject(ShoppingPreferencesService);
  private engagement = inject(EngagementService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  quantity = signal<number>(1);
  activeImageUrl = signal<string>("");
  reviews = signal<ProductReview[]>([]);
  engagementMessage = signal("");
  alertEmail = "";
  selectedVariant = "";

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.loadProduct(+id);
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.preferences.remember(prod);
        this.engagement
          .reviews(prod.id)
          .subscribe({ next: (reviews) => this.reviews.set(reviews) });
        this.activeImageUrl.set(prod.primaryImageUrl);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  increaseQty(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQty(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  addToCart(prod: Product): void {
    this.cartService.addToCart(
      prod,
      this.quantity(),
      this.selectedVariant || undefined,
    );
    this.cartService.isDrawerOpen.set(true);
  }

  getWhatsAppUrl(prod: Product): string {
    const unitPrice = this.unitPrice(prod);
    const text = encodeURIComponent(
      `Hello Sobuj Enterprise, I would like to order:\n\n*${prod.title}*\nSKU: ${prod.sku}\nQuantity: ${this.quantity()}\nUnit Price: ৳${unitPrice}\nTotal: ৳${unitPrice * this.quantity()}\n\nPlease confirm availability and delivery destination.`,
    );
    return `https://wa.me/8801827801872?text=${text}`;
  }

  wholesaleTiers(prod: Product): { minQuantity: number; unitPrice: number }[] {
    try {
      return (
        JSON.parse(prod.wholesaleTiersJson || "[]") as {
          minQuantity: number;
          unitPrice: number;
        }[]
      )
        .filter((t) => t.minQuantity > 0 && t.unitPrice > 0)
        .sort((a, b) => a.minQuantity - b.minQuantity);
    } catch {
      return [];
    }
  }

  unitPrice(prod: Product): number {
    return this.cartService.getUnitPrice(prod, this.quantity());
  }

  createStockAlert(productId: number): void {
    if (!this.alertEmail.includes("@")) {
      this.engagementMessage.set("Enter a valid email address.");
      return;
    }
    this.engagement
      .stockAlert(productId, this.alertEmail)
      .subscribe({
        next: (r) => this.engagementMessage.set(r.message),
        error: () =>
          this.engagementMessage.set(
            "Could not save the alert. Please try again.",
          ),
      });
  }
}
