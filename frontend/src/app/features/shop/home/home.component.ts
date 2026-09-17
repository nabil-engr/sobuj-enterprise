// ============================================================================
// Sobuj Enterprise - Professional Stationery Storefront & Dynamic Smart Catalog
// ============================================================================

import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../../core/services/cart.service";
import { ProductService } from "../../../core/services/product.service";
import { Product, FilterAttribute } from "../../../core/models";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

// ----------------------------------------------------------------------------
// 1. Homepage Component (Professional Stationery Brand Showcase)
// ----------------------------------------------------------------------------
// 1. Homepage Component (Faithful Google Stitch Design)
// ----------------------------------------------------------------------------
@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  cart = inject(CartService);
  productService = inject(ProductService);

  categories = [
    {
      name: "Paper & Notebooks",
      slug: "paper-notebooks",
      itemCount: 0,
      icon: "menu_book",
    },
    {
      name: "Writing & Pens",
      slug: "writing-correction",
      itemCount: 0,
      icon: "edit_note",
    },
    {
      name: "Office Supplies",
      slug: "office-supplies",
      itemCount: 0,
      icon: "inventory_2",
    },
    {
      name: "School Essentials",
      slug: "school-essentials",
      itemCount: 0,
      icon: "backpack",
    },
    {
      name: "Art & Crafts",
      slug: "art-craft-supplies",
      itemCount: 0,
      icon: "palette",
    },
    {
      name: "Desk Storage",
      slug: "desk-organization",
      itemCount: 0,
      icon: "desktop_windows",
    },
  ];

  displayBrands: {
    id?: number;
    name: string;
    slug?: string;
    logoUrl?: string;
    website?: string;
  }[] = [
    { name: "Double A", website: "doubleapaper.com" },
    { name: "Pilot", website: "pilotpen.com" },
    { name: "Deli", website: "deliworld.com" },
    { name: "Faber-Castell", website: "faber-castell.com" },
    { name: "Matador", website: "matador.com.bd" },
    { name: "Good Luck", website: "prangroup.com" },
    { name: "Fresh", website: "mgi.org" },
    { name: "Doms", website: "domsindia.com" },
    { name: "Kangaro", website: "kangaro.com" },
    { name: "Zebra", website: "zebrapen.com" },
    { name: "Casio", website: "casio.com" },
    { name: "Uni-ball", website: "uniball.com" },
  ];

  brandLogo(brand: { logoUrl?: string; website?: string }): string {
    if (brand.logoUrl) return brand.logoUrl;
    const domain = (brand.website || "")
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    return domain
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      : "";
  }

  popularProducts: Product[] = [];
  newArrivalProducts: Product[] = [];
  allProducts: Product[] = [];
  productCarouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    nav: true,
    navText: ["‹", "›"],
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    margin: 8,
    responsive: {
      0: { items: 1 },
      520: { items: 2 },
      820: { items: 3 },
      1180: { items: 4 },
    },
  };
  secondaryCarouselOptions: OwlOptions = {
    ...this.productCarouselOptions,
    autoplayTimeout: 4500,
    dots: false,
    responsive: { 0: { items: 1 }, 640: { items: 2 }, 1100: { items: 3 } },
  };

  get showcaseSections() {
    const category = (p: Product) => p.category?.slug || "";
    return [
      {
        key: "new",
        eyebrow: "Just added",
        title: "New Arrivals",
        icon: "new_releases",
        iconClass: "bg-amber-100 text-amber-700",
        query: { sortBy: "newest" },
        products: this.allProducts.filter((p) => p.isNewArrival),
      },
      {
        key: "office",
        eyebrow: "Work essentials",
        title: "Office Desk Essentials",
        icon: "business_center",
        iconClass: "bg-[#dff8ed] text-[#006c4e]",
        query: { category: "office-supplies" },
        products: this.allProducts.filter((p) =>
          ["office-supplies", "desk-organization", "paper-notebooks"].includes(
            category(p),
          ),
        ),
      },
      {
        key: "creative",
        eyebrow: "Learn & create",
        title: "School and Art Supplies",
        icon: "palette",
        iconClass: "bg-violet-100 text-violet-700",
        query: { category: "art-craft-supplies" },
        products: this.allProducts.filter((p) =>
          [
            "school-essentials",
            "art-craft-supplies",
            "writing-correction",
          ].includes(category(p)),
        ),
      },
      {
        key: "deals",
        eyebrow: "Save more",
        title: "Deals and Special Prices",
        icon: "sell",
        iconClass: "bg-red-100 text-red-700",
        query: { sortBy: "price_asc" },
        products: this.allProducts.filter(
          (p) => !!p.discountPrice && p.discountPrice < p.price,
        ),
      },
    ];
  }

  ngOnInit(): void {
    this.productService.getProducts({ pageSize: 500 }).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.applyProductData(res.items);
        } else {
          this.loadFallbackProducts();
        }
      },
      error: () => this.loadFallbackProducts(),
    });

    this.productService.getBrands().subscribe({
      next: (brands) => {
        if (brands && brands.length > 0) {
          this.displayBrands = brands;
        }
      },
      error: () => {},
    });
  }

  addToCart(prod: Product): void {
    this.cart.addToCart(prod);
    this.cart.isDrawerOpen.set(true);
  }

  private loadFallbackProducts(): void {
    const seed: Product[] = [
      {
        id: 1,
        title: "Double A Copier Paper A4 80 GSM (500 Sheets/Ream)",
        slug: "double-a-copier-paper-a4-80-gsm",
        sku: "PAP-DBL-A4-80",
        price: 560,
        discountPrice: 520,
        stockQuantity: 150,
        categoryId: 2,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop",
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 428,
        brand: { id: 4, name: "Double A", slug: "double-a", isFeatured: true },
      },
      {
        id: 2,
        title: "Pilot G2 Premium Gel Roller Pen 0.5mm (Pack of 3)",
        slug: "pilot-g2-gel-pen-0-5mm",
        sku: "PEN-PLT-G2-05",
        price: 450,
        discountPrice: 420,
        stockQuantity: 95,
        categoryId: 3,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1585336261026-418071839958?w=600&auto=format&fit=crop",
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 312,
        brand: { id: 3, name: "Pilot", slug: "pilot", isFeatured: true },
      },
      {
        id: 3,
        title: "Deli Heavy Duty Desktop Stapler with 1000 Staples",
        slug: "deli-heavy-duty-desktop-stapler",
        sku: "OFF-DELI-STP-01",
        price: 380,
        discountPrice: 340,
        stockQuantity: 60,
        categoryId: 1,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop",
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        rating: 4.8,
        reviewCount: 190,
        brand: { id: 2, name: "Deli", slug: "deli", isFeatured: true },
      },
      {
        id: 4,
        title: "Faber-Castell Connector Paint Box 24 Watercolor Set",
        slug: "faber-castell-connector-paint-box-24",
        sku: "ART-FC-WCL-24",
        price: 950,
        discountPrice: 880,
        stockQuantity: 40,
        categoryId: 4,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop",
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 165,
        brand: {
          id: 1,
          name: "Faber-Castell",
          slug: "faber-castell",
          isFeatured: true,
        },
      },
      {
        id: 5,
        title: "Hardcover Spiral Dot Grid Journal A5 (160 Pages 100 GSM)",
        slug: "hardcover-spiral-dot-grid-journal-a5",
        sku: "NBK-JRN-A5-DOT",
        price: 420,
        discountPrice: 380,
        stockQuantity: 75,
        categoryId: 2,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop",
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        rating: 5.0,
        reviewCount: 92,
      },
      {
        id: 6,
        title: "Doms Neon Eraser & Pencil Combo Stationery Kit",
        slug: "doms-neon-stationery-combo-kit",
        sku: "SCH-DOMS-KIT-01",
        price: 180,
        discountPrice: 150,
        stockQuantity: 200,
        categoryId: 5,
        primaryImageUrl:
          "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop",
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.7,
        reviewCount: 59,
        brand: { id: 7, name: "Doms", slug: "doms", isFeatured: true },
      },
    ];

    this.applyProductData(seed);
  }

  private applyProductData(products: Product[]): void {
    this.allProducts = products;
    const categoryIds: Record<string, number> = {
      "office-supplies": 1,
      "paper-notebooks": 2,
      "writing-correction": 3,
      "art-craft-supplies": 4,
      "school-essentials": 5,
      "desk-organization": 6,
    };
    this.categories = this.categories.map((category) => ({
      ...category,
      itemCount: products.filter(
        (product) =>
          product.category?.slug === category.slug ||
          product.categoryId === categoryIds[category.slug],
      ).length,
    }));
    this.popularProducts = products.filter(
      (product) => product.isBestSeller || product.isFeatured,
    );
    this.newArrivalProducts = products
      .filter((product) => product.isNewArrival)
      .slice(0, 3);
    if (this.popularProducts.length < 5) this.popularProducts = products;
    if (this.newArrivalProducts.length === 0)
      this.newArrivalProducts = products.slice(0, 3);
  }
}

// ----------------------------------------------------------------------------
// 2. Shop Catalog Component with Context-Aware Category Filtering
// ----------------------------------------------------------------------------
