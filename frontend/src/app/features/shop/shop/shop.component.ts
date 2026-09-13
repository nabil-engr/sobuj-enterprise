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
  selector: "app-shop",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  cart = inject(CartService);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  availableBrands: string[] = [
    "Double A",
    "Pilot",
    "Deli",
    "Faber-Castell",
    "Doms",
    "Zebra",
  ];

  activeCategorySlug: string | null = null;
  maxPrice = 3000;
  searchQuery = "";
  sortBy = "newest";
  selectedBrands: string[] = [];
  selectedTags: string[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.activeCategorySlug = params["category"] || null;
      if (params["search"]) {
        this.searchQuery = params["search"];
      }
      this.filterCatalog();
    });

    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productService.getProducts({ pageSize: 50 }).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.allProducts = res.items;
        } else {
          this.allProducts = this.getStationerySeedProducts();
        }
        this.filterCatalog();
      },
      error: () => {
        this.allProducts = this.getStationerySeedProducts();
        this.filterCatalog();
      },
    });
  }

  filterCatalog() {
    let list = [...this.allProducts];

    // 1. Category-specific scoping
    if (this.activeCategorySlug) {
      list = list.filter((p) => {
        if (this.activeCategorySlug === "paper-notebooks")
          return (
            p.categoryId === 2 ||
            p.title.toLowerCase().includes("paper") ||
            p.title.toLowerCase().includes("journal")
          );
        if (this.activeCategorySlug === "writing-correction")
          return p.categoryId === 3 || p.title.toLowerCase().includes("pen");
        if (this.activeCategorySlug === "office-supplies")
          return (
            p.categoryId === 1 ||
            p.title.toLowerCase().includes("stapler") ||
            p.title.toLowerCase().includes("tray")
          );
        if (this.activeCategorySlug === "school-essentials")
          return (
            p.categoryId === 5 ||
            p.title.toLowerCase().includes("pencil") ||
            p.title.toLowerCase().includes("school")
          );
        if (this.activeCategorySlug === "art-craft-supplies")
          return (
            p.categoryId === 4 ||
            p.title.toLowerCase().includes("paint") ||
            p.title.toLowerCase().includes("color")
          );
        if (this.activeCategorySlug === "desk-organization")
          return (
            p.categoryId === 6 || p.title.toLowerCase().includes("organizer")
          );
        return true;
      });
    }

    // 2. Price filter
    list = list.filter((p) => (p.discountPrice || p.price) <= this.maxPrice);

    // 3. Brand filter
    if (this.selectedBrands.length > 0) {
      list = list.filter(
        (p) => p.brand?.name && this.selectedBrands.includes(p.brand.name),
      );
    }

    // 4. Tags filter
    if (this.selectedTags.length > 0) {
      list = list.filter((p) =>
        this.selectedTags.some(
          (t) =>
            p.title.includes(t) || (p.tags && p.tags.includes(t.toLowerCase())),
        ),
      );
    }

    // 5. Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.brand?.name && p.brand.name.toLowerCase().includes(q)),
      );
    }

    // 6. Sorting
    if (this.sortBy === "price_asc")
      list.sort(
        (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
      );
    else if (this.sortBy === "price_desc")
      list.sort(
        (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price),
      );
    else if (this.sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    this.filteredProducts = list;
  }

  selectCategory(slug: string | null) {
    this.activeCategorySlug = slug;
    this.filterCatalog();
  }

  toggleBrand(brand: string) {
    if (this.selectedBrands.includes(brand)) {
      this.selectedBrands = this.selectedBrands.filter((b) => b !== brand);
    } else {
      this.selectedBrands.push(brand);
    }
    this.filterCatalog();
  }

  toggleCustomTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterCatalog();
  }

  resetFilters() {
    this.selectedBrands = [];
    this.selectedTags = [];
    this.maxPrice = 3000;
    this.searchQuery = "";
    this.activeCategorySlug = null;
    this.filterCatalog();
  }

  getCategoryTitle(slug: string): string {
    const map: Record<string, string> = {
      "paper-notebooks": "Paper & Notebooks",
      "writing-correction": "Writing & Correction Pens",
      "office-supplies": "Office Supplies & Fasteners",
      "school-essentials": "School Essentials & Kits",
      "art-craft-supplies": "Fine Arts & Craft Materials",
      "desk-organization": "Desk Storage & Organizers",
    };
    return map[slug] || "Stationery Catalog";
  }

  private getStationerySeedProducts(): Product[] {
    return [
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
        reviewCount: 84,
        brand: { id: 4, name: "Double A", slug: "double-a", isFeatured: true },
        tags: "paper,a4,80 gsm,double a",
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
        reviewCount: 120,
        brand: { id: 3, name: "Pilot", slug: "pilot", isFeatured: true },
        tags: "pen,gel,0.5mm,pilot",
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
        reviewCount: 42,
        brand: { id: 2, name: "Deli", slug: "deli", isFeatured: true },
        tags: "stapler,office,deli",
      },
      {
        id: 4,
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
        tags: "school,pencil,doms,eraser",
      },
      {
        id: 5,
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
        isBestSeller: false,
        rating: 4.9,
        reviewCount: 36,
        brand: {
          id: 1,
          name: "Faber-Castell",
          slug: "faber-castell",
          isFeatured: true,
        },
        tags: "art,paint,watercolor",
      },
      {
        id: 6,
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
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 92,
        tags: "a5,journal,notebook",
      },
    ];
  }
}

