import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      
      <!-- Storefront chrome is intentionally hidden inside the admin console. -->
      @if (!isAdminRoute()) {
      <header class="w-full z-50 sticky top-0 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
        <div class="bg-[#064e3b] text-white py-1.5 px-4 lg:px-12 text-xs">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-4 truncate">
              <span class="flex items-center gap-1 font-bold text-amber-300">
                <span class="material-symbols-outlined text-[16px]">workspace_premium</span> 30+ Years of Excellence (Est. 1994)
              </span>
              <span class="hidden md:inline text-white/40">|</span>
              <span class="hidden md:flex items-center gap-1 text-emerald-200">
                <span class="material-symbols-outlined text-[16px]">bolt</span> Bogura & Nationwide Express Dispatch
              </span>
              <span class="hidden lg:inline text-white/40">|</span>
              <span class="hidden lg:flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">call</span> Hotline: 01712-204763
              </span>
              <span class="hidden 2xl:inline text-white/40">|</span>
              <span class="hidden 2xl:flex items-center gap-1 text-[#97f5cc]">
                <span class="material-symbols-outlined text-[16px]">verified</span> 100% Genuine Double A • Pilot • Deli Direct
              </span>
            </div>

            <div class="flex items-center gap-4 flex-shrink-0">
              <a routerLink="/shop" class="text-white hover:text-emerald-200 transition-colors font-medium">Corporate Requisition</a>
            </div>
          </div>
        </div>

        <!-- Main Brand Navbar -->
        <div class="bg-white py-3 px-4 lg:px-12 border-b border-slate-100">
          <div class="max-w-7xl mx-auto flex items-center justify-between gap-5">
            
            <!-- Logo Section -->
            <a routerLink="/" class="flex items-center flex-shrink-0" aria-label="Sobuj Enterprise home">
              <img src="assets/sobuj-enterprise-logo.png" alt="Sobuj Enterprise" class="w-40 lg:w-44 h-auto object-contain" />
            </a>

            <!-- Search Bar with Category Dropdown -->
            <div class="hidden md:flex flex-1 min-w-0 max-w-2xl items-center bg-[#f2f3ff] rounded-xl p-1 focus-within:ring-2 focus-within:ring-[#006c4e] transition-all">
              <div class="flex-1 flex items-center px-3">
                <span class="material-symbols-outlined text-slate-400 mr-2 text-[20px]">search</span>
                <input [(ngModel)]="navbarSearch" (keyup.enter)="onSearch()" class="w-full bg-transparent text-xs text-[#131b2e] placeholder:text-slate-400 focus:outline-none" placeholder="Search 1,500+ genuine stationery products, Double A, Pilot G2..." type="text">
              </div>
              <button (click)="onSearch()" type="button" class="bg-[#003527] hover:bg-[#064e3b] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                <span class="material-symbols-outlined text-[16px]">search</span>
                <span>Search</span>
              </button>
            </div>

            <!-- Header Action Controls -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <a href="https://wa.me/8801827801872" target="_blank" class="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#003527] rounded-full transition-colors">
                <span class="text-base">💬</span>
                <div class="flex flex-col text-left">
                  <span class="text-[9px] text-[#006c4e] font-extrabold uppercase">WhatsApp</span>
                  <span class="text-xs text-[#003527] font-black">01827-801872</span>
                </div>
              </a>

              <a href="tel:01712204763" class="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003527] rounded-full transition-colors">
                <span class="material-symbols-outlined text-[#006c4e] text-[20px]">support_agent</span>
                <div class="flex flex-col text-left">
                  <span class="text-[9px] text-slate-400 font-bold uppercase">Hotline</span>
                  <span class="text-xs text-[#003527] font-black">01712-204763</span>
                </div>
              </a>

              @if (auth.isAuthenticated()) {
                <div class="flex items-center gap-2">
                  <a routerLink="/account" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003527] rounded-xl text-xs font-bold transition">
                    <span class="material-symbols-outlined text-[16px]">account_circle</span>
                    <span>My Account</span>
                  </a>
                  @if (auth.isAdmin()) {
                    <a routerLink="/admin" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#003527] text-white hover:bg-[#064e3b] rounded-xl text-xs font-bold transition shadow-sm">
                      <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      <span>Admin</span>
                    </a>
                  }
                  <button (click)="auth.logout()" class="text-xs text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl font-bold transition border border-red-200">
                    Logout
                  </button>
                </div>
              } @else {
                <a routerLink="/auth/login" class="text-xs font-bold text-[#003527] bg-[#f2f3ff] hover:bg-[#eaedff] px-4 py-2 rounded-xl transition">
                  Sign In
                </a>
              }

              <!-- Basket Trigger -->
              <button (click)="cart.isDrawerOpen.set(true)" class="flex items-center gap-2 bg-[#003527] hover:bg-[#064e3b] text-white px-3 lg:px-4 py-2 rounded-xl shadow-sm transition-all" type="button">
                <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                <div class="flex flex-col text-left">
                  <span class="hidden xl:block text-[9px] text-[#97f5cc] font-bold uppercase">Dispatch Basket</span>
                  <span class="text-xs font-black">৳ {{ cart.subTotal }} ({{ cart.totalItemsCount }})</span>
                </div>
              </button>
            </div>

          </div>
        </div>

        <!-- Navigation Departments Strip -->
        <div class="bg-white/95 backdrop-blur-md px-4 lg:px-12 border-b border-slate-100">
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <nav class="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-2 scrollbar-none text-xs font-bold text-slate-600">
              <a routerLink="/shop" class="px-3 py-1.5 rounded-lg bg-[#f2f3ff] text-[#003527] transition">All Products</a>
              <a routerLink="/shop" [queryParams]="{category: 'paper-notebooks'}" class="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#003527] transition">Paper & Notebooks</a>
              <a routerLink="/shop" [queryParams]="{category: 'writing-correction'}" class="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#003527] transition">Writing & Pens</a>
              <a routerLink="/shop" [queryParams]="{category: 'office-supplies'}" class="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#003527] transition">Office Supplies</a>
              <a routerLink="/shop" [queryParams]="{category: 'school-essentials'}" class="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-[#003527] transition">School & Art</a>
            </nav>
            <div class="hidden lg:flex items-center">
              <a routerLink="/shop" class="text-xs font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition">
                🔥 Bulk Deals & Offers
              </a>
            </div>
          </div>
        </div>
      </header>
      }

      <!-- Main Body Router Outlet -->
      <main class="flex-1 w-full">
        <router-outlet></router-outlet>
      </main>

      <!-- Cart Drawer -->
      @if (cart.isDrawerOpen()) {
        <div class="fixed inset-0 z-50 overflow-hidden">
          <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" (click)="cart.isDrawerOpen.set(false)"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div class="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div class="p-5 border-b flex justify-between items-center bg-[#faf8ff]">
                <h3 class="font-extrabold text-[#003527] text-base flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#006c4e]">shopping_bag</span>
                  <span>Dispatch Basket</span>
                  <span class="text-xs bg-[#eaedff] text-[#003527] font-bold px-2 py-0.5 rounded-full">{{ cart.totalItemsCount }} items</span>
                </h3>
                <button (click)="cart.isDrawerOpen.set(false)" class="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
              </div>

              <div class="flex-1 overflow-y-auto p-5 space-y-3">
                @if (cart.cartItems().length === 0) {
                  <div class="text-center py-16 text-slate-400">
                    <span class="material-symbols-outlined text-4xl text-slate-300">production_quantity_limits</span>
                    <p class="text-xs font-semibold mt-2">Your stationery basket is empty.</p>
                  </div>
                } @else {
                  @for (item of cart.cartItems(); track item.product.id) {
                    <div class="flex justify-between items-center pb-3 border-b border-slate-100 text-xs">
                      <div class="max-w-[210px]">
                        <h4 class="font-bold text-slate-800 line-clamp-1">{{ item.product.title }}</h4>
                        <p class="text-slate-400 mt-0.5">Qty: {{ item.quantity }} × ৳{{ item.product.discountPrice || item.product.price }}</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="font-black text-slate-900">৳{{ (item.product.discountPrice || item.product.price) * item.quantity }}</span>
                        <button (click)="cart.removeFromCart(item.product.id)" class="text-red-500 font-bold hover:underline">✕</button>
                      </div>
                    </div>
                  }
                }
              </div>

              <div class="p-5 border-t bg-[#f2f3ff] space-y-2 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span class="font-bold text-slate-900">৳{{ cart.subTotal }}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Dhaka 24h Express Delivery</span>
                  <span class="text-[#006c4e] font-bold">৳60</span>
                </div>
                <div class="flex justify-between text-sm font-black text-[#003527] border-t pt-2">
                  <span>Estimated Total</span>
                  <span>৳{{ cart.subTotal + 60 }}</span>
                </div>
                <a routerLink="/checkout" (click)="cart.isDrawerOpen.set(false)" class="block w-full text-center bg-[#003527] hover:bg-[#064e3b] text-white font-black py-3 rounded-xl shadow-md transition mt-2">
                  Proceed to WhatsApp Checkout →
                </a>
              </div>
            </div>
          </div>
        </div>
      }

      @if (!isAdminRoute()) {
      <!-- Footer from Stitch Design -->
      <footer class="bg-[#f2f3ff] text-slate-600 py-14 border-t border-slate-200 mt-16 text-xs">
        <div class="max-w-7xl mx-auto px-4 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-[#006c4e] rounded-xl flex items-center justify-center font-black text-white text-base">S</div>
              <span class="font-extrabold text-[#003527] text-base">Sobuj Enterprise</span>
            </div>
            <p class="leading-relaxed text-slate-600">
              Bangladesh's apex direct distributor and stationery partner since 1994. 30+ years of uninterrupted supply of archival papers and genuine writing instruments.
            </p>
            <div class="flex items-center gap-2 pt-1">
              <span class="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                ★ 30+ Years Legacy
              </span>
              <span class="bg-[#97f5cc]/20 text-[#97f5cc] border border-[#97f5cc]/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                100% Authentic Stock
              </span>
            </div>
          </div>
          <div>
            <h5 class="text-[#131b2e] font-bold uppercase mb-3 text-[11px] tracking-wider">Official Partner Brands</h5>
            <ul class="space-y-1.5 text-slate-600">
              <li>Double A Paper (Thailand) ✓</li>
              <li>Pilot Pen Corporation (Japan) ✓</li>
              <li>Deli Stationery Global ✓</li>
              <li>Faber-Castell Fine Art (Germany) ✓</li>
              <li>DOMS Academic Sets ✓</li>
            </ul>
          </div>
          <div>
            <h5 class="text-[#131b2e] font-bold uppercase mb-3 text-[11px] tracking-wider">Corporate Fulfillment</h5>
            <ul class="space-y-1.5 text-slate-600">
              <li>📞 Direct Hotline: 01712-204763</li>
              <li>💬 WhatsApp: 01827-801872</li>
              <li>📑 Official Printed Store Memo & Slip</li>
              <li>⚡ Express Dispatch & Courier Delivery</li>
              <li>💼 Institutional & Retail Bulk Orders</li>
            </ul>
          </div>
          <div>
            <h5 class="text-[#131b2e] font-bold uppercase mb-3 text-[11px] tracking-wider">Store & Pickup Hub</h5>
            <p class="leading-relaxed text-slate-600">Sobuj Enterprise, Shatmatha New Market, Bogura, Bangladesh.</p>
            <div class="pt-3">
              <span class="block text-[10px] font-bold text-[#97f5cc] uppercase tracking-wider mb-1">Accepted Payments:</span>
              <div class="flex flex-wrap gap-1.5 text-[10px]">
                <span class="bg-white/10 px-2 py-0.5 rounded text-white font-semibold">Cash on Delivery</span>
                <span class="bg-white/10 px-2 py-0.5 rounded text-white font-semibold">bKash</span>
                <span class="bg-white/10 px-2 py-0.5 rounded text-white font-semibold">Nagad</span>
                <span class="bg-white/10 px-2 py-0.5 rounded text-white font-semibold">Bank PO</span>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 lg:px-12 mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 1994 - 2026 Sobuj Enterprise. Shatmatha New Market, Bogura. All Rights Reserved.</p>
          <div class="flex items-center gap-4">
            <a routerLink="/shop" class="hover:text-white transition">Catalog</a>
            <span>•</span>
            <a routerLink="/checkout" class="hover:text-white transition">Corporate RFQ</a>
            <span>•</span>
            <a href="https://wa.me/8801827801872" target="_blank" class="hover:text-[#97f5cc] transition flex items-center gap-1 font-bold">
              <span class="material-symbols-outlined text-[14px]">chat</span>
              WhatsApp Support
            </a>
          </div>
        </div>
      </footer>
      }

    </div>
  `
})
export class AppComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  router = inject(Router);

  navbarSearch = '';

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  onSearch() {
    if (this.navbarSearch.trim()) {
      this.router.navigate(['/shop'], { queryParams: { search: this.navbarSearch.trim() } });
      this.navbarSearch = '';
    } else {
      this.router.navigate(['/shop']);
    }
  }
}
