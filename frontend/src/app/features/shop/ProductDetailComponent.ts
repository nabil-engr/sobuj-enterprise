// ============================================================================
// Sobuj Enterprise - Product Detail Component (Faithful Stitch Design)
// ============================================================================

import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../core/services/product.service";
import { CartService } from "../../core/services/cart.service";
import { Product } from "../../core/models/models";

@Component({
  selector: "app-product-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8ff] py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb Navigation -->
        <nav
          class="flex items-center gap-2 text-xs text-[#707974] mb-6 flex-wrap"
        >
          <a
            routerLink="/"
            class="hover:text-[#003527] transition-colors font-medium"
            >Home</a
          >
          <span class="material-symbols-outlined text-[14px]"
            >chevron_right</span
          >
          <a
            routerLink="/shop"
            class="hover:text-[#003527] transition-colors font-medium"
            >Shop Catalog</a
          >
          <span class="material-symbols-outlined text-[14px]"
            >chevron_right</span
          >
          <span
            class="text-[#131b2e] font-bold truncate max-w-xs sm:max-w-md"
            >{{ product()?.title || "Product Details" }}</span
          >
        </nav>

        @if (isLoading()) {
          <div class="p-16 text-center">
            <div
              class="w-12 h-12 border-4 border-[#006c4e] border-t-transparent rounded-full animate-spin mx-auto mb-4"
            ></div>
            <p class="text-sm font-bold text-[#707974]">
              Loading product specifications...
            </p>
          </div>
        } @else {
          @if (product(); as prod) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Column: Gallery & Proof Badges -->
            <div class="lg:col-span-6 space-y-4">
              <div
                class="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden group"
              >
                <!-- Status Badges -->
                <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  <span
                    class="bg-[#064e3b] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                  >
                    <span
                      class="material-symbols-outlined text-[14px] text-[#97f5cc]"
                      >verified</span
                    >
                    {{ prod.brand?.name || "Sobuj Essentials" }} Official
                  </span>
                  <span
                    class="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-[12px]"
                      >workspace_premium</span
                    >
                    30+ Yrs Trust
                  </span>
                  @if (prod.isBestSeller || prod.isFeatured) {
                    <span
                      class="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
                    >
                      Top Pick
                    </span>
                  }
                </div>

                <!-- Main Image Stage -->
                <div
                  class="relative w-full aspect-square bg-[#f2f3ff] rounded-xl overflow-hidden flex items-center justify-center p-6"
                >
                  <img
                    [src]="activeImageUrl() || prod.primaryImageUrl"
                    [alt]="prod.title"
                    class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              <!-- Thumbnails -->
              <div class="grid grid-cols-4 gap-3">
                <button
                  (click)="activeImageUrl.set(prod.primaryImageUrl)"
                  class="bg-white p-1 rounded-xl shadow-sm border-2 transition-all"
                  [class.border-[#003527]]="
                    activeImageUrl() === prod.primaryImageUrl
                  "
                  [class.border-transparent]="
                    activeImageUrl() !== prod.primaryImageUrl
                  "
                >
                  <div
                    class="aspect-square rounded-lg bg-[#f2f3ff] overflow-hidden flex items-center justify-center p-1"
                  >
                    <img
                      [src]="prod.primaryImageUrl"
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <span
                    class="text-[10px] text-[#131b2e] mt-1 block truncate text-center font-bold"
                    >Front Retail</span
                  >
                </button>
              </div>
            </div>

            <!-- Right Column: Specs, Pricing, Bulk Tiers & Actions -->
            <div class="lg:col-span-6 space-y-6">
              <div>
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    class="inline-flex items-center gap-1 text-[#006c4e] font-bold text-xs bg-[#97f5cc]/30 px-3 py-1 rounded-full"
                  >
                    <span class="material-symbols-outlined text-[14px]"
                      >store</span
                    >
                    {{ prod.brand?.name || "Authorized Brand" }} Official
                  </span>
                  <span
                    class="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full"
                    >Est. 1994 Bogura Hub</span
                  >
                  <span class="text-[#707974] text-xs">• Bogura Ready</span>
                </div>
                <h1
                  class="text-2xl sm:text-3xl font-black text-[#131b2e] tracking-tight leading-tight"
                  >
                    {{ prod.title }}
                </h1>
                <p class="text-xs text-[#707974] mt-2 font-mono">
                  SKU: {{ prod.sku }} • 100% Quality Inspected
                </p>
              </div>

              <!-- Pricing Stage -->
              <div
                class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-black text-[#003527]"
                    >৳{{ prod.discountPrice || prod.price }}</span
                  >
                  @if (prod.discountPrice) {
                    <span
                      class="text-sm font-semibold text-[#707974] line-through"
                      >৳{{ prod.price }}</span
                    >
                  }
                  <span class="text-sm font-semibold text-[#707974]"
                    >/ Unit</span
                  >
                </div>
                <div class="flex items-center gap-2 text-xs text-[#006c4e] font-bold">
                  <span class="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Ready for Same-Day Express Dispatch</span>
                </div>
                @if (wholesaleTiers(prod).length) {
                  <div class="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <div class="flex items-center gap-1.5 text-xs font-black text-[#006c4e] mb-2"><span class="material-symbols-outlined text-[17px]">inventory_2</span> Wholesale price breaks</div>
                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      @for (tier of wholesaleTiers(prod); track tier.minQuantity) {
                        <div class="rounded-lg bg-white px-2 py-2 text-center border border-emerald-100"><div class="text-[10px] text-slate-500">{{ tier.minQuantity }}+ units</div><div class="text-sm font-black text-[#003527]">৳{{ tier.unitPrice }}</div><div class="text-[10px] text-emerald-700">per unit</div></div>
                      }
                    </div>
                    <p class="mt-2 text-[11px] font-semibold text-[#006c4e]">{{ quantity() >= wholesaleTiers(prod)[0].minQuantity ? 'Wholesale rate applied to your quantity.' : 'Increase quantity to unlock wholesale rates.' }}</p>
                  </div>
                }
              </div>

              <!-- Description -->
              <div
                class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
              >
                <h3
                  class="text-xs font-black text-[#003527] uppercase tracking-wider"
                >
                  Product Overview
                </h3>
                <p class="text-xs leading-relaxed text-slate-600">
                  {{
                    prod.description ||
                      prod.shortDescription ||
                      "High quality original stationery product imported directly by Sobuj Enterprise."
                  }}
                </p>
              </div>

              <!-- Quantity and Purchase Actions -->
              <div
                class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
              >
                <div class="flex items-center gap-4">
                  <label class="text-xs font-black text-slate-800"
                    >Quantity:</label
                  >
                  <div
                    class="flex items-center border border-slate-200 rounded-xl overflow-hidden"
                  >
                    <button
                      (click)="decreaseQty()"
                      class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold transition"
                    >
                      -
                    </button>
                    <span
                      class="px-4 py-1.5 text-xs font-bold text-slate-900"
                      >{{ quantity() }}</span
                    >
                    <button
                      (click)="increaseQty()"
                      class="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                  <span class="text-xs font-bold text-slate-900 ml-auto">
                    Subtotal:
                    <strong class="text-base text-[#003527]"
                      >৳{{
                        unitPrice(prod) * quantity()
                      }}</strong
                    >
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    (click)="addToCart(prod)"
                    class="w-full bg-[#003527] hover:bg-[#064e3b] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >add_shopping_cart</span
                    >
                    <span>Add to Dispatch Basket</span>
                  </button>

                  <a
                    [href]="getWhatsAppUrl(prod)"
                    target="_blank"
                    class="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >chat</span
                    >
                    <span>Instant WhatsApp Order</span>
                  </a>
                </div>
              </div>

              <!-- Corporate Wholesale Banner -->
              <div
                class="bg-gradient-to-r from-[#003527] to-[#006c4e] text-white p-5 rounded-2xl shadow-md flex items-center justify-between gap-4"
              >
                <div>
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider text-[#97f5cc] block"
                    >Need Corporate Bulk Requisition?</span
                  >
                  <p class="text-xs font-medium text-white/90 mt-0.5">
                    Special pricing for 20+ reams or bulk student stationery
                    packages with direct delivery support.
                  </p>
                </div>
                <a
                  routerLink="/checkout"
                  class="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap shadow transition"
                >
                  Corporate Order →
                </a>
              </div>
            </div>
          </div>

          <section class="mt-12 bg-[#f2f3ff] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10">
            <div class="flex flex-wrap gap-2 mb-5">
              <button class="bg-[#003527] text-white px-5 py-2.5 rounded-lg text-xs font-bold">Product Specifications</button>
              <button class="bg-white text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold border border-slate-200">Corporate Bulk Pricing</button>
              <button class="bg-white text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold border border-slate-200">Customer Reviews ({{ prod.reviewCount }})</button>
              <button class="bg-white text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold border border-slate-200">Shipping & Dispatch Policy</button>
            </div>
            <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 class="text-lg font-black text-[#003527]">Technical Specifications & Quality Parameters</h2>
                  <p class="text-xs text-slate-500">Verified product details for procurement and quality-control review.</p>
                </div>
                <span class="text-xs font-bold text-[#006c4e] bg-[#97f5cc]/30 px-3 py-2 rounded-lg">verified Authentic Product Data</span>
              </div>
              <div class="divide-y divide-slate-100 text-xs">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f2f3ff]"><strong>Product SKU</strong><span class="sm:col-span-2">{{ prod.sku }}</span></div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4"><strong>Brand / Manufacturer</strong><span class="sm:col-span-2">{{ prod.brand?.name || 'Sobuj Enterprise Authorized Partner' }}</span></div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f2f3ff]"><strong>Category</strong><span class="sm:col-span-2">{{ prod.category?.name || 'Premium Stationery' }}</span></div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4"><strong>Availability</strong><span class="sm:col-span-2 text-emerald-700 font-bold">Ready for dispatch</span></div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#f2f3ff]"><strong>Quality Assurance</strong><span class="sm:col-span-2">100% original stock, batch inspected and replacement guaranteed</span></div>
              </div>
            </div>
          </section>

          <section class="py-12">
            <p class="text-[10px] font-black uppercase tracking-wider text-[#006c4e]">Frequently combined office staples</p>
            <h2 class="text-xl font-black text-[#003527] mb-5">Executive Desk Power Bundle</h2>
            <div class="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex flex-wrap items-center gap-5">
                <div class="flex items-center gap-3"><img [src]="prod.primaryImageUrl" [alt]="prod.title" class="w-20 h-20 object-contain bg-[#f2f3ff] rounded-xl p-2"><div><p class="text-xs font-bold max-w-44 line-clamp-2">{{ prod.title }}</p><strong class="text-[#003527]">৳{{ prod.discountPrice || prod.price }}</strong></div></div>
                <span class="material-symbols-outlined text-slate-400">add_box</span>
                <div class="bg-[#f2f3ff] rounded-xl p-4"><p class="text-xs font-bold">Corporate stationery add-on</p><p class="text-[11px] text-slate-500">Curated by procurement team</p></div>
              </div>
              <button (click)="addToCart(prod)" class="bg-[#003527] text-white rounded-xl px-6 py-3 text-xs font-black whitespace-nowrap">Add Complete Bundle</button>
            </div>
          </section>
          } @else {
          <div
            class="p-16 text-center bg-white rounded-3xl border border-slate-200"
          >
            <h3 class="text-lg font-black text-slate-900 mb-2">
              Product Not Found
            </h3>
            <p class="text-xs text-slate-500 mb-4">
              The item you requested does not exist or may have been updated.
            </p>
            <a
              routerLink="/shop"
              class="bg-[#003527] text-white px-5 py-2.5 rounded-xl font-bold text-xs inline-block"
            >
              Back to Catalog
            </a>
          </div>
          }
        }
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  quantity = signal<number>(1);
  activeImageUrl = signal<string>("");

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
    this.cartService.addToCart(prod, this.quantity());
    this.cartService.isDrawerOpen.set(true);
  }

  getWhatsAppUrl(prod: Product): string {
    const unitPrice = this.unitPrice(prod);
    const text = encodeURIComponent(
      `Hello Sobuj Enterprise, I would like to order:\n\n*${prod.title}*\nSKU: ${prod.sku}\nQuantity: ${this.quantity()}\nUnit Price: ৳${unitPrice}\nTotal: ৳${unitPrice * this.quantity()}\n\nPlease confirm availability and delivery destination.`
    );
    return `https://wa.me/8801827801872?text=${text}`;
  }

  wholesaleTiers(prod: Product): { minQuantity: number; unitPrice: number }[] {
    try {
      return (JSON.parse(prod.wholesaleTiersJson || '[]') as { minQuantity: number; unitPrice: number }[])
        .filter(t => t.minQuantity > 0 && t.unitPrice > 0).sort((a, b) => a.minQuantity - b.minQuantity);
    } catch { return []; }
  }

  unitPrice(prod: Product): number {
    return this.cartService.getUnitPrice(prod, this.quantity());
  }
}
