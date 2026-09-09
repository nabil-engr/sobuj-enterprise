// ============================================================================
// Sobuj Enterprise - Professional Stationery Storefront & Dynamic Smart Catalog
// ============================================================================

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product, FilterAttribute } from '../../core/models/models';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

// ----------------------------------------------------------------------------
// 1. Homepage Component (Professional Stationery Brand Showcase)
// ----------------------------------------------------------------------------
// 1. Homepage Component (Faithful Google Stitch Design)
// ----------------------------------------------------------------------------
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselModule],
  template: `
    <!-- 1. HERO SECTION -->
    <section class="relative w-full overflow-hidden bg-gradient-to-br from-[#003527] via-[#064e3b] to-[#006c4e] text-white py-12 md:py-16 px-4 lg:px-12 shadow-md">
      <!-- Geometric Micro-Grid Ambient SVG Background -->
      <div class="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <svg class="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="40" id="grid-pattern" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.75"></path>
              <circle cx="40" cy="40" fill="currentColor" r="1.5"></circle>
            </pattern>
          </defs>
          <rect fill="url(#grid-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div class="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <!-- Left Column: Content -->
        <div class="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-6">
          <!-- Authorized Badge -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[#97f5cc] text-[#002115] text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
              <span>🇧🇩</span>
              <span>Bangladesh Authorized Importer & Distributor</span>
            </div>
            <div class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
              <span class="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>30+ Years of Excellence (Since 1994)</span>
            </div>
          </div>

          <!-- Hero Headline -->
          <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Genuine Stationery.<br><span class="text-amber-300">Delivered Fast.</span>
          </h1>

          <!-- Subtext -->
          <p class="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
            Original office, school and art supplies from trusted brands.
          </p>

          <!-- Trust Indicators -->
          <div class="flex flex-wrap items-center gap-2.5 pt-1">
            <div class="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold"><span class="text-amber-300 font-extrabold">★ 4.9/5</span></div>
            <div class="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold">
              <span class="material-symbols-outlined text-[#97f5cc] text-[18px]">bolt</span>
              <span>Fast Delivery</span>
            </div>
            <div class="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-semibold">
              <span class="material-symbols-outlined text-[#97f5cc] text-[18px]">verified</span>
              <span>100% Original</span>
            </div>
          </div>

          <!-- Action CTAs -->
          <div class="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
            <a routerLink="/shop" class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-md text-xs sm:text-sm font-extrabold">
              Browse Full Catalog
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
            <a href="https://wa.me/8801827801872?text=Hello%20Sobuj%20Enterprise,%20I%20want%20to%20place%20a%20stationery%20order" target="_blank" class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all shadow-md text-xs sm:text-sm font-extrabold">
              <span class="material-symbols-outlined text-[18px]">chat</span>
              WhatsApp Order
            </a>
            <a routerLink="/shop" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all text-xs sm:text-sm font-bold">
              <span class="material-symbols-outlined text-[18px]">inventory</span>
              Bulk Inquiry & Quotes
            </a>
          </div>
        </div>

        <!-- Right Column: Visual Showcase Stage -->
        <div class="lg:col-span-5 relative flex justify-center items-center">
          <div class="relative w-full rounded-2xl bg-white p-4 shadow-2xl overflow-hidden flex flex-col gap-3">
            <div class="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <img class="w-full h-full object-cover" alt="Corporate stationery flatlay" src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span class="text-xs bg-[#003527]/90 px-3 py-1 rounded-full backdrop-blur-sm font-bold">Archival Quality</span>
                <span class="text-xs font-black text-[#97f5cc]">৳ 520 / Ream</span>
              </div>
            </div>

            <!-- Mini Quick Highlights Strip -->
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="bg-[#f2f3ff] p-2.5 rounded-lg">
                <span class="block text-xs text-[#003527] font-black">A4 80 GSM</span>
                <span class="block text-[11px] text-slate-500">Zero-Jam Paper</span>
              </div>
              <div class="bg-[#f2f3ff] p-2.5 rounded-lg">
                <span class="block text-xs text-[#003527] font-black">Pilot Japan</span>
                <span class="block text-[11px] text-slate-500">Smooth Gel Tech</span>
              </div>
              <div class="bg-[#f2f3ff] p-2.5 rounded-lg">
                <span class="block text-xs text-[#003527] font-black">Top Brands</span>
                <span class="block text-[11px] text-slate-500">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. OFFICIAL BRAND PARTNERS STRIP - SMOOTH RIGHT-TO-LEFT MARQUEE -->
    <section class="w-full bg-[#eaedff]/60 border-y border-slate-200/60 py-4 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center gap-4">
        <div class="flex items-center gap-2 flex-shrink-0 z-10 bg-[#eaedff]/80 md:bg-transparent pr-3">
          <span class="material-symbols-outlined text-[#006c4e] text-[22px]">verified</span>
          <div>
            <span class="text-xs text-[#003527] font-black uppercase tracking-wider block">Top Stationery Brands</span>
            <span class="text-[11px] text-slate-500">100% Genuine Authorized Supplies</span>
          </div>
        </div>

        <!-- Marquee Track (Smooth right-to-left animation) -->
        <div class="flex-1 w-full overflow-hidden relative">
          <div class="animate-marquee-rtl flex items-center gap-3">
            <!-- First Set -->
            @for (b of displayBrands; track $index) {
              <a [routerLink]="['/shop']" [queryParams]="{search: b.name}" class="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-emerald-50 rounded-xl shadow-sm text-xs font-black text-[#003527] border border-slate-200/80 transition-all hover:scale-105">
                <img [src]="brandLogo(b)" [alt]="b.name + ' logo'" (error)="$any($event.target).style.display='none'" class="h-5 w-5 rounded object-contain" />
                <span>{{ b.name }}</span>
              </a>
            }
            <!-- Seamless Duplicate Loop Set -->
            @for (b of displayBrands; track 'loop-' + $index) {
              <a [routerLink]="['/shop']" [queryParams]="{search: b.name}" class="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-emerald-50 rounded-xl shadow-sm text-xs font-black text-[#003527] border border-slate-200/80 transition-all hover:scale-105">
                <img [src]="brandLogo(b)" [alt]="b.name + ' logo'" (error)="$any($event.target).style.display='none'" class="h-5 w-5 rounded object-contain" />
                <span>{{ b.name }}</span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 30+ YEARS HERITAGE & TRUST BANNER -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-gradient-to-r from-[#002117] via-[#003527] to-[#004d38] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#97f5cc]/10 blur-3xl pointer-events-none"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div class="lg:col-span-8 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              Established 1994 • Shatmatha New Market, Bogura
            </div>
            
            <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              30+ Years of Undisputed Trust in <span class="text-amber-300">Stationery Distribution</span>
            </h2>
            
            <p class="text-white/85 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Since 1994, Sobuj Enterprise has served as northern Bangladesh's premier stationery hub and direct importer for world-class paper, pens, and institutional supplies. From leading banks, government offices, colleges, and schools across Bogura, Rajshahi and nationwide — we guarantee 100% genuine products with zero counterfeit risk.
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span class="block text-2xl sm:text-3xl font-black text-amber-300">30+</span>
                <span class="text-[11px] text-white/80 font-medium">Years in Business</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span class="block text-2xl sm:text-3xl font-black text-[#97f5cc]">1,200+</span>
                <span class="text-[11px] text-white/80 font-medium">Corporate & School Clients</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span class="block text-2xl sm:text-3xl font-black text-amber-300">100%</span>
                <span class="text-[11px] text-white/80 font-medium">Authentic Guarantee</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                <span class="block text-2xl sm:text-3xl font-black text-[#97f5cc]">Same-Day</span>
                <span class="text-[11px] text-white/80 font-medium">Bogura City Dispatch</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex flex-col gap-3 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <h3 class="font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">security</span>
              Why Customers Rely On Us:
            </h3>
            <ul class="space-y-2.5 text-xs text-white/90">
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[#97f5cc] text-[16px] mt-0.5">check_circle</span>
                <span><strong>Direct Manufacturer Stock:</strong> Official hologram and genuine batch verification.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[#97f5cc] text-[16px] mt-0.5">check_circle</span>
                <span><strong>Official Store Receipt:</strong> Clear itemized printed memo provided with every order.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[#97f5cc] text-[16px] mt-0.5">check_circle</span>
                <span><strong>Money-Back Guarantee:</strong> Immediate refund or replacement for any damaged or sub-standard unit.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[#97f5cc] text-[16px] mt-0.5">check_circle</span>
                <span><strong>Bogura Shatmatha Hub:</strong> Ready stock for instant in-store pickup or prompt courier delivery.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- 4. HOW EASY IT IS TO ORDER (3 SIMPLE STEPS) -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center max-w-xl mx-auto mb-8">
        <span class="text-[11px] font-black uppercase text-[#006c4e] tracking-wider block">Seamless Experience</span>
        <h2 class="text-2xl font-black text-[#003527] tracking-tight">How to Order in 3 Simple Steps</h2>
        <p class="text-xs text-slate-500 mt-1">No complicated account creation needed. Order online or directly over WhatsApp in seconds.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative text-center flex flex-col items-center">
          <div class="w-14 h-14 rounded-2xl bg-[#eaedff] text-[#003527] font-black text-xl flex items-center justify-center mb-4 shadow-sm">
            1
          </div>
          <h3 class="font-bold text-slate-900 text-sm mb-1.5">Choose Genuine Items</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Select authentic Double A paper reams, Pilot pens, Deli tools, or school sets with verified specifications.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative text-center flex flex-col items-center">
          <div class="w-14 h-14 rounded-2xl bg-[#97f5cc] text-[#002115] font-black text-xl flex items-center justify-center mb-4 shadow-sm">
            2
          </div>
          <h3 class="font-bold text-slate-900 text-sm mb-1.5">1-Click WhatsApp or Cart</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Tap "WhatsApp Order" for instant messaging confirmation, or checkout online with Cash on Delivery / bKash.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative text-center flex flex-col items-center">
          <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center mb-4 shadow-sm">
            3
          </div>
          <h3 class="font-bold text-slate-900 text-sm mb-1.5">Same-Day Express Dispatch</h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Our Dhaka fleet delivers directly to your office floor or home with valid invoice, sealed packaging, and receipt.
          </p>
        </div>
      </div>
    </section>

    <!-- 5. SHOP BY DEPARTMENT -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-end mb-8">
        <div>
          <span class="text-[11px] font-black uppercase text-[#006c4e] tracking-wider block">Categorized Procurement</span>
          <h2 class="text-2xl sm:text-3xl font-black text-[#003527] tracking-tight">Shop by Department</h2>
          <p class="text-xs text-slate-500 mt-1">Explore comprehensive corporate, executive & student stationery inventory.</p>
        </div>
        <a routerLink="/shop" class="inline-flex items-center gap-1 text-xs font-bold text-[#006c4e] hover:text-[#003527] hover:underline transition">
          View Full Catalog
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        @for (cat of categories; track cat.slug) {
          <a [routerLink]="['/shop']" [queryParams]="{category: cat.slug}" class="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#006c4e] transition-all hover:-translate-y-1">
            <div class="w-16 h-16 rounded-full bg-[#f2f3ff] flex items-center justify-center mb-3 group-hover:bg-[#97f5cc] transition-colors">
              <span class="material-symbols-outlined text-[#003527] text-[30px] group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
            </div>
            <h3 class="font-bold text-slate-800 text-xs group-hover:text-[#003527] transition line-clamp-1">{{ cat.name }}</h3>
            <span class="text-[11px] text-slate-400 mt-0.5">{{ cat.itemCount }} {{ cat.itemCount === 1 ? 'Item' : 'Items' }}</span>
          </a>
        }
      </div>
    </section>

    <!-- Product-first carousel showcase -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      <div class="flex items-end justify-between mb-5">
        <div><span class="text-[10px] font-black uppercase tracking-wider text-[#006c4e]">Top picks</span><h2 class="text-2xl font-black text-[#003527]">Featured Products</h2></div>
        <a routerLink="/shop" class="text-xs font-bold text-[#006c4e]">View all →</a>
      </div>
      @if (popularProducts.length) {
        <owl-carousel-o [options]="productCarouselOptions">
          @for (p of popularProducts; track p.id) {
            <ng-template carouselSlide>
              <article class="mx-2 bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:border-emerald-300 hover:shadow-lg transition">
                <a [routerLink]="['/product',p.id]" class="block h-52 bg-[#f2f3ff] relative overflow-hidden">
                  <img [src]="p.primaryImageUrl" [alt]="p.title" class="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300">
                  @if(p.discountPrice){<span class="absolute top-3 left-3 bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-[10px] font-black">SAVE ৳{{p.price-p.discountPrice}}</span>}
                </a>
                <div class="p-4">
                  <p class="text-[10px] font-black uppercase text-[#006c4e]">{{p.brand?.name||'Original Product'}}</p>
                  <a [routerLink]="['/product',p.id]" class="font-bold text-sm text-slate-900 line-clamp-2 min-h-10 mt-1">{{p.title}}</a>
                  <div class="flex items-center justify-between mt-4"><div><b class="text-xl text-[#003527]">৳{{p.discountPrice||p.price}}</b>@if(p.discountPrice){<small class="line-through text-slate-400 ml-2">৳{{p.price}}</small>}</div><button (click)="addToCart(p)" class="w-10 h-10 rounded-xl bg-[#003527] text-white flex items-center justify-center"><span class="material-symbols-outlined">add_shopping_cart</span></button></div>
                </div>
              </article>
            </ng-template>
          }
        </owl-carousel-o>
      }
    </section>

    @for (showcase of showcaseSections; track showcase.key) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden border-t border-slate-100">
        <div class="flex items-end justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center" [class]="showcase.iconClass"><span class="material-symbols-outlined">{{showcase.icon}}</span></div>
            <div><span class="text-[10px] font-black uppercase tracking-wider text-[#006c4e]">{{showcase.eyebrow}}</span><h2 class="text-xl sm:text-2xl font-black text-[#003527]">{{showcase.title}}</h2></div>
          </div>
          <a [routerLink]="['/shop']" [queryParams]="showcase.query" class="hidden sm:block text-xs font-bold text-[#006c4e]">Explore all →</a>
        </div>
        @if (showcase.products.length) {
          <owl-carousel-o [options]="secondaryCarouselOptions">
            @for (p of showcase.products; track p.id) {
              <ng-template carouselSlide>
                <article class="mx-2 bg-white rounded-2xl border border-slate-200 p-3 flex gap-3 min-h-36 hover:border-emerald-300 hover:shadow-md transition group">
                  <a [routerLink]="['/product',p.id]" class="w-28 sm:w-32 flex-shrink-0 rounded-xl bg-[#f2f3ff] overflow-hidden"><img [src]="p.primaryImageUrl" [alt]="p.title" loading="lazy" class="w-full h-full object-contain p-2 group-hover:scale-105 transition"></a>
                  <div class="min-w-0 flex-1 py-1 flex flex-col"><span class="text-[9px] uppercase font-black text-[#006c4e]">{{p.brand?.name||showcase.eyebrow}}</span><a [routerLink]="['/product',p.id]" class="text-xs font-bold text-slate-900 line-clamp-2 mt-1">{{p.title}}</a><div class="mt-auto"><p class="font-black text-[#003527]">৳{{p.discountPrice||p.price}}</p><button (click)="addToCart(p)" class="mt-2 text-[11px] font-bold text-white bg-[#003527] px-3 py-1.5 rounded-lg">+ Add to cart</button></div></div>
                </article>
              </ng-template>
            }
          </owl-carousel-o>
        } @else {
          <div class="h-40 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-3xl text-slate-300">inventory_2</span><p class="text-sm font-bold text-slate-500 mt-2">Products coming soon</p><p class="text-[11px] text-slate-400">Add products from Admin → Products & Inventory</p>
          </div>
        }
      </section>
    }

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <div class="rounded-3xl bg-[#003527] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <div><h2 class="text-xl md:text-2xl font-black">Bulk order?</h2><p class="text-sm text-white/70 mt-1">Get a quick quotation and delivery plan.</p></div>
        <a href="https://wa.me/8801827801872?text=Hello%20Sobuj%20Enterprise,%20I%20need%20a%20bulk%20order%20quotation" target="_blank" class="bg-[#25D366] text-white px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap">Get WhatsApp Quote</a>
      </div>
    </section>

    <!-- Legacy product grids retained for catalog data but hidden on the simplified home. -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-end mb-6">
        <div>
          <div class="inline-flex items-center gap-1 text-amber-600 text-xs font-bold uppercase tracking-wider">
            <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            Verified High Demand Stock
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-[#003527] tracking-tight">Popular Bestsellers</h2>
          <p class="text-xs text-slate-500 mt-0.5">Most procured stationery products by Dhaka corporate offices and students.</p>
        </div>
        <a routerLink="/shop" class="text-xs font-bold text-[#006c4e] hover:underline flex items-center gap-1">
          See All Bestsellers →
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (p of popularProducts; track p.id) {
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 p-4 flex flex-col justify-between group">
            <div>
              <a [routerLink]="['/product', p.id]" class="relative block overflow-hidden rounded-xl bg-[#f2f3ff] mb-3 h-48 flex items-center justify-center cursor-pointer">
                <img [src]="p.primaryImageUrl" [alt]="p.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
                @if (p.discountPrice) {
                  <span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                    SAVE ৳{{ p.price - p.discountPrice }}
                  </span>
                }
              </a>

              <span class="text-[10px] font-bold text-[#006c4e] uppercase tracking-wider">{{ p.brand?.name || 'Authorized Brand' }}</span>
              <a [routerLink]="['/product', p.id]" class="block font-bold text-slate-800 text-sm mt-0.5 line-clamp-2 leading-snug hover:text-[#006c4e] transition">
                {{ p.title }}
              </a>

              <div class="flex items-center gap-1 text-amber-500 text-xs mt-1.5">
                <span>★ {{ p.rating }}</span>
                <span class="text-slate-400">({{ p.reviewCount }} verified reviews)</span>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-base font-black text-[#003527]">৳{{ p.discountPrice || p.price }}</span>
                @if (p.discountPrice) {
                  <span class="text-xs text-slate-400 line-through ml-1.5">৳{{ p.price }}</span>
                }
              </div>
              <button (click)="addToCart(p)" class="bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition transform active:scale-95 flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                <span>Add</span>
              </button>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- 7. NEW ARRIVALS & FRESH IMPORTS -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-end mb-6">
        <div>
          <div class="inline-flex items-center gap-1 text-[#006c4e] text-xs font-bold uppercase tracking-wider">
            <span class="material-symbols-outlined text-[16px]">new_releases</span>
            Freshly Landed Stock
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-[#003527] tracking-tight">New Arrivals & Creative Essentials</h2>
          <p class="text-xs text-slate-500 mt-0.5">Latest factory-sealed arrivals directly cleared from port terminals.</p>
        </div>
        <a routerLink="/shop" class="text-xs font-bold text-[#006c4e] hover:underline flex items-center gap-1">
          Explore All New Stock →
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        @for (p of newArrivalProducts; track p.id) {
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition p-4 flex gap-4 items-center group">
            <a [routerLink]="['/product', p.id]" class="w-28 h-28 flex-shrink-0 bg-[#f2f3ff] rounded-xl overflow-hidden flex items-center justify-center p-2">
              <img [src]="p.primaryImageUrl" [alt]="p.title" class="w-full h-full object-cover group-hover:scale-105 transition" />
            </a>
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">NEW IN STORE</span>
              <a [routerLink]="['/product', p.id]" class="block font-bold text-slate-800 text-xs sm:text-sm mt-1 line-clamp-2 hover:text-[#006c4e] transition">
                {{ p.title }}
              </a>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm font-black text-[#003527]">৳{{ p.discountPrice || p.price }}</span>
                <button (click)="addToCart(p)" class="text-xs font-bold text-[#006c4e] hover:bg-[#f2f3ff] px-2.5 py-1 rounded-lg transition border border-[#97f5cc]">
                  + Add
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- 8. CORPORATE WHOLESALE BANNER -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="relative rounded-3xl bg-gradient-to-r from-[#003527] via-[#064e3b] to-[#006c4e] p-8 sm:p-10 text-white shadow-xl overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#003527] text-xs font-bold shadow-sm">
              <span class="material-symbols-outlined text-[#006c4e] text-[16px]">domain</span>
              Corporate Procurement & Tender Desk
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">
              Need 50+ Reams or Custom Corporate Kits?
            </h3>
            <p class="text-xs sm:text-sm text-white/85 leading-relaxed">
              We supply banks, multinational corporations, schools, and institutions across Dhaka. Enjoy dedicated credit terms, scheduled deliveries, and wholesale rates.
            </p>
          </div>
          <div class="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <a routerLink="/checkout" class="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition">
              Create Corporate Order
            </a>
            <a href="https://wa.me/8801827801872?text=Hello%20Sobuj%20Enterprise,%20we%20need%20a%20corporate%20wholesale%20quote" target="_blank" class="bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-[#97f5cc]">chat</span>
              WhatsApp RFQ
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. REAL CLIENT TESTIMONIALS & TRUST PROOF -->
    <section class="hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="text-center max-w-2xl mx-auto mb-8">
        <span class="text-[11px] font-black uppercase text-[#006c4e] tracking-wider block">Verified Reviews</span>
        <h2 class="text-2xl sm:text-3xl font-black text-[#003527] tracking-tight">Trusted by Institutions Nationwide</h2>
        <p class="text-xs text-slate-500 mt-1">See how leading corporate offices and institutions rely on Sobuj Enterprise for authentic stationery.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Testimonial 1 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs leading-relaxed text-slate-700 italic">
              "We have been procuring Double A 80GSM paper for our corporate head office from Sobuj Enterprise for over 8 years. Consistently genuine packaging, zero paper jams in our laser printers, and prompt delivery."
            </p>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
            <div class="w-10 h-10 rounded-full bg-[#003527] text-white font-bold flex items-center justify-center text-xs">
              GP
            </div>
            <div>
              <h4 class="font-bold text-xs text-slate-900">Kazi Farhan Ahmed</h4>
              <p class="text-[10px] text-slate-500">Procurement Officer, Corporate Hub Dhaka</p>
            </div>
          </div>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs leading-relaxed text-slate-700 italic">
              "Their 1-click WhatsApp order feature is brilliant for urgent restocks. We ordered 15 packs of Pilot G2 pens and Deli heavy-duty staplers; they arrived in Dhanmondi within 4 hours!"
            </p>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
            <div class="w-10 h-10 rounded-full bg-[#006c4e] text-white font-bold flex items-center justify-center text-xs">
              NS
            </div>
            <div>
              <h4 class="font-bold text-xs text-slate-900">Nasreen Sultana</h4>
              <p class="text-[10px] text-slate-500">Admin Manager, Educational Institute</p>
            </div>
          </div>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs leading-relaxed text-slate-700 italic">
              "Finding authentic Faber-Castell and Pilot pens without counterfeit risk was always difficult until we found Sobuj Enterprise. With their 30+ year reputation, we never have to second guess."
            </p>
          </div>
          <div class="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4">
            <div class="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
              TI
            </div>
            <div>
              <h4 class="font-bold text-xs text-slate-900">Tariqul Islam Chowdhury</h4>
              <p class="text-[10px] text-slate-500">Director, Creative Agency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  cart = inject(CartService);
  productService = inject(ProductService);

  categories = [
    { name: 'Paper & Notebooks', slug: 'paper-notebooks', itemCount: 0, icon: 'menu_book' },
    { name: 'Writing & Pens', slug: 'writing-correction', itemCount: 0, icon: 'edit_note' },
    { name: 'Office Supplies', slug: 'office-supplies', itemCount: 0, icon: 'inventory_2' },
    { name: 'School Essentials', slug: 'school-essentials', itemCount: 0, icon: 'backpack' },
    { name: 'Art & Crafts', slug: 'art-craft-supplies', itemCount: 0, icon: 'palette' },
    { name: 'Desk Storage', slug: 'desk-organization', itemCount: 0, icon: 'desktop_windows' }
  ];

  displayBrands: { id?: number; name: string; slug?: string; logoUrl?: string; website?: string }[] = [
    { name: 'Double A', website: 'doubleapaper.com' }, { name: 'Pilot', website: 'pilotpen.com' },
    { name: 'Deli', website: 'deliworld.com' }, { name: 'Faber-Castell', website: 'faber-castell.com' },
    { name: 'Matador', website: 'matador.com.bd' }, { name: 'Good Luck', website: 'prangroup.com' },
    { name: 'Fresh', website: 'mgi.org' }, { name: 'Doms', website: 'domsindia.com' },
    { name: 'Kangaro', website: 'kangaro.com' }, { name: 'Zebra', website: 'zebrapen.com' },
    { name: 'Casio', website: 'casio.com' }, { name: 'Uni-ball', website: 'uniball.com' }
  ];

  brandLogo(brand: { logoUrl?: string; website?: string }): string {
    if (brand.logoUrl) return brand.logoUrl;
    const domain = (brand.website || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
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
    navText: ['‹', '›'],
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    margin: 8,
    responsive: {
      0: { items: 1 },
      520: { items: 2 },
      820: { items: 3 },
      1180: { items: 4 }
    }
  };
  secondaryCarouselOptions: OwlOptions = {
    ...this.productCarouselOptions,
    autoplayTimeout: 4500,
    dots: false,
    responsive: { 0: { items: 1 }, 640: { items: 2 }, 1100: { items: 3 } }
  };

  get showcaseSections() {
    const category = (p: Product) => p.category?.slug || '';
    return [
      { key: 'new', eyebrow: 'Just added', title: 'New Arrivals', icon: 'new_releases', iconClass: 'bg-amber-100 text-amber-700', query: { sortBy: 'newest' }, products: this.allProducts.filter(p => p.isNewArrival) },
      { key: 'office', eyebrow: 'Work essentials', title: 'Office Desk Essentials', icon: 'business_center', iconClass: 'bg-[#dff8ed] text-[#006c4e]', query: { category: 'office-supplies' }, products: this.allProducts.filter(p => ['office-supplies','desk-organization','paper-notebooks'].includes(category(p))) },
      { key: 'creative', eyebrow: 'Learn & create', title: 'School and Art Supplies', icon: 'palette', iconClass: 'bg-violet-100 text-violet-700', query: { category: 'art-craft-supplies' }, products: this.allProducts.filter(p => ['school-essentials','art-craft-supplies','writing-correction'].includes(category(p))) },
      { key: 'deals', eyebrow: 'Save more', title: 'Deals and Special Prices', icon: 'sell', iconClass: 'bg-red-100 text-red-700', query: { sortBy: 'price_asc' }, products: this.allProducts.filter(p => !!p.discountPrice && p.discountPrice < p.price) }
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
      error: () => this.loadFallbackProducts()
    });

    this.productService.getBrands().subscribe({
      next: (brands) => {
        if (brands && brands.length > 0) {
          this.displayBrands = brands;
        }
      },
      error: () => {}
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
        title: 'Double A Copier Paper A4 80 GSM (500 Sheets/Ream)',
        slug: 'double-a-copier-paper-a4-80-gsm',
        sku: 'PAP-DBL-A4-80',
        price: 560,
        discountPrice: 520,
        stockQuantity: 150,
        categoryId: 2,
        primaryImageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 428,
        brand: { id: 4, name: 'Double A', slug: 'double-a', isFeatured: true }
      },
      {
        id: 2,
        title: 'Pilot G2 Premium Gel Roller Pen 0.5mm (Pack of 3)',
        slug: 'pilot-g2-gel-pen-0-5mm',
        sku: 'PEN-PLT-G2-05',
        price: 450,
        discountPrice: 420,
        stockQuantity: 95,
        categoryId: 3,
        primaryImageUrl: 'https://images.unsplash.com/photo-1585336261026-418071839958?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 312,
        brand: { id: 3, name: 'Pilot', slug: 'pilot', isFeatured: true }
      },
      {
        id: 3,
        title: 'Deli Heavy Duty Desktop Stapler with 1000 Staples',
        slug: 'deli-heavy-duty-desktop-stapler',
        sku: 'OFF-DELI-STP-01',
        price: 380,
        discountPrice: 340,
        stockQuantity: 60,
        categoryId: 1,
        primaryImageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        rating: 4.8,
        reviewCount: 190,
        brand: { id: 2, name: 'Deli', slug: 'deli', isFeatured: true }
      },
      {
        id: 4,
        title: 'Faber-Castell Connector Paint Box 24 Watercolor Set',
        slug: 'faber-castell-connector-paint-box-24',
        sku: 'ART-FC-WCL-24',
        price: 950,
        discountPrice: 880,
        stockQuantity: 40,
        categoryId: 4,
        primaryImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 165,
        brand: { id: 1, name: 'Faber-Castell', slug: 'faber-castell', isFeatured: true }
      },
      {
        id: 5,
        title: 'Hardcover Spiral Dot Grid Journal A5 (160 Pages 100 GSM)',
        slug: 'hardcover-spiral-dot-grid-journal-a5',
        sku: 'NBK-JRN-A5-DOT',
        price: 420,
        discountPrice: 380,
        stockQuantity: 75,
        categoryId: 2,
        primaryImageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        rating: 5.0,
        reviewCount: 92
      },
      {
        id: 6,
        title: 'Doms Neon Eraser & Pencil Combo Stationery Kit',
        slug: 'doms-neon-stationery-combo-kit',
        sku: 'SCH-DOMS-KIT-01',
        price: 180,
        discountPrice: 150,
        stockQuantity: 200,
        categoryId: 5,
        primaryImageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop',
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.7,
        reviewCount: 59,
        brand: { id: 7, name: 'Doms', slug: 'doms', isFeatured: true }
      }
    ];

    this.applyProductData(seed);
  }

  private applyProductData(products: Product[]): void {
    this.allProducts = products;
    const categoryIds: Record<string, number> = {
      'office-supplies': 1,
      'paper-notebooks': 2,
      'writing-correction': 3,
      'art-craft-supplies': 4,
      'school-essentials': 5,
      'desk-organization': 6
    };
    this.categories = this.categories.map(category => ({
      ...category,
      itemCount: products.filter(product =>
        product.category?.slug === category.slug || product.categoryId === categoryIds[category.slug]
      ).length
    }));
    this.popularProducts = products.filter(product => product.isBestSeller || product.isFeatured);
    this.newArrivalProducts = products.filter(product => product.isNewArrival).slice(0, 3);
    if (this.popularProducts.length < 5) this.popularProducts = products;
    if (this.newArrivalProducts.length === 0) this.newArrivalProducts = products.slice(0, 3);
  }
}


// ----------------------------------------------------------------------------
// 2. Shop Catalog Component with Context-Aware Category Filtering
// ----------------------------------------------------------------------------
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Breadcrumb & Header -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-200">
        <div>
          <div class="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <a routerLink="/" class="hover:text-emerald-700">Home</a>
            <span>/</span>
            <span class="text-slate-700 font-semibold">Shop Catalog</span>
            @if (activeCategorySlug) {
              <span>/</span>
              <span class="text-emerald-800 font-bold uppercase">{{ getCategoryTitle(activeCategorySlug) }}</span>
            }
          </div>
          <h1 class="text-2xl font-black text-slate-900">
            {{ activeCategorySlug ? getCategoryTitle(activeCategorySlug) : 'All Stationery Supplies' }}
          </h1>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 items-start">
        
        <!-- Smart Sidebar Filters -->
        <aside class="w-full lg:w-72 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <div class="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 class="font-black text-slate-800 text-sm flex items-center gap-2">
              <span>🔍 Filter Options</span>
            </h2>
            <button (click)="resetFilters()" class="text-xs text-emerald-700 hover:underline font-bold">Reset</button>
          </div>

          <!-- Price Range Filter -->
          <div>
            <label class="font-bold text-slate-700 text-xs block mb-2">Max Price: ৳{{ maxPrice }}</label>
            <input type="range" min="100" max="3000" step="50" [(ngModel)]="maxPrice" (change)="filterCatalog()" class="w-full accent-emerald-600 cursor-pointer">
            <div class="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>৳100</span>
              <span>৳3,000</span>
            </div>
          </div>

          <!-- Brands Filter -->
          <div class="border-t pt-4">
            <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Brands</h3>
            <div class="space-y-1.5 max-h-40 overflow-y-auto">
              @for (brand of availableBrands; track brand) {
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" [checked]="selectedBrands.includes(brand)" (change)="toggleBrand(brand)" class="rounded text-emerald-600 focus:ring-emerald-500">
                  <span>{{ brand }}</span>
                </label>
              }
            </div>
          </div>

          <!-- Context-Specific: Paper Sizes (Only show if paper or all) -->
          @if (!activeCategorySlug || activeCategorySlug === 'paper-notebooks') {
            <div class="border-t pt-4">
              <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Paper / Book Size</h3>
              <div class="space-y-1.5">
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" (change)="toggleCustomTag('A4')" [checked]="selectedTags.includes('A4')" class="rounded text-emerald-600">
                  <span>A4 Copier & Ledger</span>
                </label>
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" (change)="toggleCustomTag('A5')" [checked]="selectedTags.includes('A5')" class="rounded text-emerald-600">
                  <span>A5 Spiral Notebook</span>
                </label>
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" (change)="toggleCustomTag('80 GSM')" [checked]="selectedTags.includes('80 GSM')" class="rounded text-emerald-600">
                  <span>80 GSM High Smooth</span>
                </label>
              </div>
            </div>
          }

          <!-- Context-Specific: Pen Tip Sizes (Only show if pens or all) -->
          @if (!activeCategorySlug || activeCategorySlug === 'writing-correction') {
            <div class="border-t pt-4">
              <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Pen Nib Size</h3>
              <div class="space-y-1.5">
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" (change)="toggleCustomTag('0.5mm')" [checked]="selectedTags.includes('0.5mm')" class="rounded text-emerald-600">
                  <span>0.5 mm Fine Point</span>
                </label>
                <label class="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" (change)="toggleCustomTag('0.7mm')" [checked]="selectedTags.includes('0.7mm')" class="rounded text-emerald-600">
                  <span>0.7 mm Medium</span>
                </label>
              </div>
            </div>
          }

          <!-- Context-Specific: School Grade Supplies -->
          @if (activeCategorySlug === 'school-essentials') {
            <div class="border-t pt-4">
              <h3 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">School Supplies</h3>
              <div class="space-y-1.5 text-xs text-slate-600">
                <p class="text-[11px] text-slate-400">Pencil Sets, Dust-free Erasers, Sharpeners & Crayons</p>
              </div>
            </div>
          }
        </aside>

        <!-- Product Grid Area -->
        <main class="flex-1 w-full">
          <!-- Search & Sorting Bar -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="relative w-full sm:w-80">
              <input type="text" [(ngModel)]="searchQuery" (input)="filterCatalog()" placeholder="Search title, brand or SKU..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600">
              <span class="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span class="text-xs text-slate-500">Sort by:</span>
              <select [(ngModel)]="sortBy" (change)="filterCatalog()" class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          @if (filteredProducts.length === 0) {
            <div class="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <p class="text-3xl mb-2">🔍</p>
              <p class="text-sm font-semibold">No products found in this selection.</p>
              <button (click)="resetFilters()" class="mt-3 text-xs text-emerald-700 font-bold underline">Clear all filters</button>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              @for (product of filteredProducts; track product.id) {
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition duration-300 p-4 flex flex-col justify-between group">
                  <div>
                    <a [routerLink]="['/product', product.id]" class="relative block overflow-hidden rounded-xl bg-slate-100 mb-3 h-48 flex items-center justify-center cursor-pointer">
                      <img [src]="product.primaryImageUrl" [alt]="product.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy">
                      @if (product.discountPrice) {
                        <span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          SAVE ৳{{ product.price - product.discountPrice }}
                        </span>
                      }
                      <span class="absolute bottom-2 right-2 bg-emerald-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#97f5cc]"></span> In Stock
                      </span>
                    </a>

                    <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{{ product.brand?.name || 'Sobuj Essentials' }}</span>
                    <a [routerLink]="['/product', product.id]" class="block font-bold text-slate-800 text-sm mt-0.5 line-clamp-2 leading-snug hover:text-emerald-700 transition">
                      {{ product.title }}
                    </a>
                    
                    <div class="flex items-center gap-1 text-amber-500 text-xs mt-1.5">
                      <span>★ {{ product.rating }}</span>
                      <span class="text-slate-400">({{ product.reviewCount }} reviews)</span>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span class="text-base font-black text-slate-900">৳{{ product.discountPrice || product.price }}</span>
                      @if (product.discountPrice) {
                        <span class="text-xs text-slate-400 line-through ml-1.5">৳{{ product.price }}</span>
                      }
                    </div>
                    <button (click)="cart.addToCart(product)" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition transform active:scale-95">
                      + Add to Cart
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </main>

      </div>
    </div>
  `
})
export class ShopComponent implements OnInit {
  cart = inject(CartService);
  productService = inject(ProductService);
  route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  availableBrands: string[] = ['Double A', 'Pilot', 'Deli', 'Faber-Castell', 'Doms', 'Zebra'];

  activeCategorySlug: string | null = null;
  maxPrice = 3000;
  searchQuery = '';
  sortBy = 'newest';
  selectedBrands: string[] = [];
  selectedTags: string[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.activeCategorySlug = params['category'] || null;
      if (params['search']) {
        this.searchQuery = params['search'];
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
      }
    });
  }

  filterCatalog() {
    let list = [...this.allProducts];

    // 1. Category-specific scoping
    if (this.activeCategorySlug) {
      list = list.filter(p => {
        if (this.activeCategorySlug === 'paper-notebooks') return p.categoryId === 2 || p.title.toLowerCase().includes('paper') || p.title.toLowerCase().includes('journal');
        if (this.activeCategorySlug === 'writing-correction') return p.categoryId === 3 || p.title.toLowerCase().includes('pen');
        if (this.activeCategorySlug === 'office-supplies') return p.categoryId === 1 || p.title.toLowerCase().includes('stapler') || p.title.toLowerCase().includes('tray');
        if (this.activeCategorySlug === 'school-essentials') return p.categoryId === 5 || p.title.toLowerCase().includes('pencil') || p.title.toLowerCase().includes('school');
        if (this.activeCategorySlug === 'art-craft-supplies') return p.categoryId === 4 || p.title.toLowerCase().includes('paint') || p.title.toLowerCase().includes('color');
        if (this.activeCategorySlug === 'desk-organization') return p.categoryId === 6 || p.title.toLowerCase().includes('organizer');
        return true;
      });
    }

    // 2. Price filter
    list = list.filter(p => (p.discountPrice || p.price) <= this.maxPrice);

    // 3. Brand filter
    if (this.selectedBrands.length > 0) {
      list = list.filter(p => p.brand?.name && this.selectedBrands.includes(p.brand.name));
    }

    // 4. Tags filter
    if (this.selectedTags.length > 0) {
      list = list.filter(p => this.selectedTags.some(t => p.title.includes(t) || (p.tags && p.tags.includes(t.toLowerCase()))));
    }

    // 5. Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.brand?.name && p.brand.name.toLowerCase().includes(q)));
    }

    // 6. Sorting
    if (this.sortBy === 'price_asc') list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    else if (this.sortBy === 'price_desc') list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    else if (this.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);

    this.filteredProducts = list;
  }

  selectCategory(slug: string | null) {
    this.activeCategorySlug = slug;
    this.filterCatalog();
  }

  toggleBrand(brand: string) {
    if (this.selectedBrands.includes(brand)) {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    } else {
      this.selectedBrands.push(brand);
    }
    this.filterCatalog();
  }

  toggleCustomTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterCatalog();
  }

  resetFilters() {
    this.selectedBrands = [];
    this.selectedTags = [];
    this.maxPrice = 3000;
    this.searchQuery = '';
    this.activeCategorySlug = null;
    this.filterCatalog();
  }

  getCategoryTitle(slug: string): string {
    const map: Record<string, string> = {
      'paper-notebooks': 'Paper & Notebooks',
      'writing-correction': 'Writing & Correction Pens',
      'office-supplies': 'Office Supplies & Fasteners',
      'school-essentials': 'School Essentials & Kits',
      'art-craft-supplies': 'Fine Arts & Craft Materials',
      'desk-organization': 'Desk Storage & Organizers'
    };
    return map[slug] || 'Stationery Catalog';
  }

  private getStationerySeedProducts(): Product[] {
    return [
      {
        id: 1,
        title: 'Double A Copier Paper A4 80 GSM (500 Sheets/Ream)',
        slug: 'double-a-copier-paper-a4-80-gsm',
        sku: 'PAP-DBL-A4-80',
        price: 560,
        discountPrice: 520,
        stockQuantity: 150,
        categoryId: 2,
        primaryImageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.9,
        reviewCount: 84,
        brand: { id: 4, name: 'Double A', slug: 'double-a', isFeatured: true },
        tags: 'paper,a4,80 gsm,double a'
      },
      {
        id: 2,
        title: 'Pilot G2 Premium Gel Roller Pen 0.5mm (Pack of 3)',
        slug: 'pilot-g2-gel-pen-0-5mm',
        sku: 'PEN-PLT-G2-05',
        price: 450,
        discountPrice: 420,
        stockQuantity: 95,
        categoryId: 3,
        primaryImageUrl: 'https://images.unsplash.com/photo-1585336261026-418071839958?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 120,
        brand: { id: 3, name: 'Pilot', slug: 'pilot', isFeatured: true },
        tags: 'pen,gel,0.5mm,pilot'
      },
      {
        id: 3,
        title: 'Deli Heavy Duty Desktop Stapler with 1000 Staples',
        slug: 'deli-heavy-duty-desktop-stapler',
        sku: 'OFF-DELI-STP-01',
        price: 380,
        discountPrice: 340,
        stockQuantity: 60,
        categoryId: 1,
        primaryImageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        rating: 4.8,
        reviewCount: 42,
        brand: { id: 2, name: 'Deli', slug: 'deli', isFeatured: true },
        tags: 'stapler,office,deli'
      },
      {
        id: 4,
        title: 'Doms Neon Eraser & Pencil Combo Stationery Kit',
        slug: 'doms-neon-stationery-combo-kit',
        sku: 'SCH-DOMS-KIT-01',
        price: 180,
        discountPrice: 150,
        stockQuantity: 200,
        categoryId: 5,
        primaryImageUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop',
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        rating: 4.7,
        reviewCount: 59,
        brand: { id: 7, name: 'Doms', slug: 'doms', isFeatured: true },
        tags: 'school,pencil,doms,eraser'
      },
      {
        id: 5,
        title: 'Faber-Castell Connector Paint Box 24 Watercolor Set',
        slug: 'faber-castell-connector-paint-box-24',
        sku: 'ART-FC-WCL-24',
        price: 950,
        discountPrice: 880,
        stockQuantity: 40,
        categoryId: 4,
        primaryImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        rating: 4.9,
        reviewCount: 36,
        brand: { id: 1, name: 'Faber-Castell', slug: 'faber-castell', isFeatured: true },
        tags: 'art,paint,watercolor'
      },
      {
        id: 6,
        title: 'Hardcover Spiral Dot Grid Journal A5 (160 Pages 100 GSM)',
        slug: 'hardcover-spiral-dot-grid-journal-a5',
        sku: 'NBK-JRN-A5-DOT',
        price: 420,
        discountPrice: 380,
        stockQuantity: 75,
        categoryId: 2,
        primaryImageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        rating: 5.0,
        reviewCount: 92,
        tags: 'a5,journal,notebook'
      }
    ];
  }
}
