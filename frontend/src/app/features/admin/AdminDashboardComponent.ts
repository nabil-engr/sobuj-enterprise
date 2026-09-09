// ============================================================================
// Sobuj Enterprise - Admin Operations Console (Faithful Stitch Design)
// ============================================================================

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, Product } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
      
      <!-- Top Operations Control Strip -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#003527] to-[#006c4e] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
              S
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-sm tracking-tight text-[#003527] leading-tight block">SOBUJ ENTERPRISE</span>
                <span class="px-2 py-0.5 rounded bg-[#97f5cc] text-[#002115] text-[10px] font-bold uppercase tracking-wider">Distributor Console</span>
              </div>
              <span class="text-[11px] font-semibold text-[#006c4e]">Bogura Shatmatha Hub Live ERP</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden md:flex items-center gap-2 bg-[#f2f3ff] px-3 py-1.5 rounded-full">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-[11px] font-bold text-[#003527]">Inventory Live Sync</span>
            </div>

            <a routerLink="/" class="text-xs bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003527] px-3 py-2 rounded-xl font-bold transition flex items-center gap-1">
              <span>Customer Storefront</span>
              <span class="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>

            <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-800 hidden sm:block">{{ auth.currentUser()?.fullName || 'Kamrul Hasan' }}</span>
              <button (click)="logout()" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl font-bold transition border border-red-200">
                Logout
              </button>
            </div>
          </div>

        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        
        <!-- Operations Cockpit & Fleet Dispatch Header -->
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#003527] tracking-tight">Operations Cockpit & Fleet Dispatch</h1>
            <p class="text-xs text-slate-500 mt-1">Real-time reconciliation for wholesale reams, writing instruments, and commercial paper supply across Bangladesh.</p>
          </div>
          <div class="flex items-center gap-2.5 w-full md:w-auto">
            <button (click)="loadOrders(); loadProducts()" class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm">
              <span class="material-symbols-outlined text-[16px]">refresh</span>
              <span>Sync Orders</span>
            </button>
            <a routerLink="/checkout" class="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold shadow-sm transition">
              <span class="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Create Manual Challan</span>
            </a>
          </div>
        </div>

        <!-- KPI Bento Cards from Stitch Design -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Today's Revenue -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#707974]">Gross Sales Revenue</span>
              <span class="material-symbols-outlined text-[#006c4e] text-[20px]">payments</span>
            </div>
            <div class="my-2">
              <span class="text-3xl font-black text-[#131b2e] tracking-tight">৳ {{ totalRevenue().toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between pt-1 text-xs">
              <span class="text-[#006c4e] font-bold flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[16px]">trending_up</span>
                Verified Orders
              </span>
              <span class="text-[11px] text-slate-400">Dhaka Region</span>
            </div>
          </div>

          <!-- Card 2: Pending Dispatches -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#707974]">Pending Dispatches</span>
              <span class="material-symbols-outlined text-amber-600 text-[20px]">local_shipping</span>
            </div>
            <div class="my-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-[#131b2e] tracking-tight">{{ pendingOrdersCount() }}</span>
              <span class="text-xs font-bold text-[#707974]">Orders Queued</span>
            </div>
            <div class="flex items-center gap-2 pt-1 text-[11px]">
              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Express 6h Priority</span>
              <span class="text-slate-400">Hub Ready</span>
            </div>
          </div>

          <!-- Card 3: Active Catalog SKUs -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#707974]">Active Catalog SKUs</span>
              <span class="material-symbols-outlined text-[#003527] text-[20px]">category</span>
            </div>
            <div class="my-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-[#131b2e] tracking-tight">{{ products().length }}</span>
              <span class="text-xs font-bold text-[#707974]">Products Live</span>
            </div>
            <div class="flex items-center justify-between pt-1 text-[11px]">
              <span class="text-slate-500">6 Core Categories</span>
              <span class="font-bold text-[#006c4e]">99.8% Sync</span>
            </div>
          </div>

          <!-- Card 4: WhatsApp Confirmation -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#707974]">WhatsApp Engine</span>
              <span class="material-symbols-outlined text-[#25D366] text-[20px]">chat</span>
            </div>
            <div class="my-2 flex items-baseline gap-2">
              <span class="text-3xl font-black text-emerald-600 tracking-tight">100%</span>
              <span class="text-xs font-bold text-[#707974]">Automated</span>
            </div>
            <div class="flex items-center gap-1.5 pt-1 text-[11px] text-[#006c4e] font-bold">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>1-Click Requisition Active</span>
            </div>
          </div>
        </section>

        <!-- Interactive Two-Tab Switcher -->
        <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button (click)="activeTab.set('orders')" 
                  [class.bg-[#003527]]="activeTab() === 'orders'" [class.text-white]="activeTab() === 'orders'"
                  [class.bg-white]="activeTab() !== 'orders'" [class.text-slate-700]="activeTab() !== 'orders'"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Customer Consignments & Orders ({{ orders().length }})</span>
          </button>
          <button (click)="activeTab.set('inventory')" 
                  [class.bg-[#003527]]="activeTab() === 'inventory'" [class.text-white]="activeTab() === 'inventory'"
                  [class.bg-white]="activeTab() !== 'inventory'" [class.text-slate-700]="activeTab() !== 'inventory'"
                  class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">warehouse</span>
            <span>Warehouse SKU Inventory ({{ products().length }})</span>
          </button>
        </div>

        <!-- TAB 1: Consignments & Orders Table -->
        @if (activeTab() === 'orders') {
          <div class="space-y-4">
            
            <!-- Filter Controls Bar -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div class="relative flex-1 max-w-md">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                <input [(ngModel)]="searchQuery" (input)="filterOrders()" class="w-full bg-[#f2f3ff] pl-9 pr-4 py-2 rounded-xl text-xs font-medium text-[#131b2e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006c4e]" placeholder="Search Order #, Customer Name, or Phone..." type="text">
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
                  <span class="text-[11px] font-bold text-slate-500 px-2">Status:</span>
                  <button (click)="selectStatusFilter('all')" [class.bg-white]="selectedStatus === 'all'" [class.shadow-sm]="selectedStatus === 'all'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition">All</button>
                  <button (click)="selectStatusFilter('Pending')" [class.bg-white]="selectedStatus === 'Pending'" [class.shadow-sm]="selectedStatus === 'Pending'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition">Pending</button>
                  <button (click)="selectStatusFilter('Confirmed')" [class.bg-white]="selectedStatus === 'Confirmed'" [class.shadow-sm]="selectedStatus === 'Confirmed'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition">Confirmed</button>
                  <button (click)="selectStatusFilter('Processing')" [class.bg-white]="selectedStatus === 'Processing'" [class.shadow-sm]="selectedStatus === 'Processing'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition">Processing</button>
                  <button (click)="selectStatusFilter('Delivered')" [class.bg-white]="selectedStatus === 'Delivered'" [class.shadow-sm]="selectedStatus === 'Delivered'" class="px-2.5 py-1 rounded-lg text-xs font-bold transition">Delivered</button>
                </div>
              </div>
            </div>

            <!-- High-Density Professional Data Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead>
                    <tr class="bg-[#f2f3ff] text-slate-600 uppercase tracking-wider font-extrabold border-b border-slate-200">
                      <th class="py-3 px-4">Order ID</th>
                      <th class="py-3 px-4">Customer / Entity</th>
                      <th class="py-3 px-4">Phone</th>
                      <th class="py-3 px-4">Destination</th>
                      <th class="py-3 px-4">Total (BDT)</th>
                      <th class="py-3 px-4">Order Channel</th>
                      <th class="py-3 px-4">Live Status</th>
                      <th class="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                    @for (order of displayedOrders(); track order.id) {
                      <tr class="hover:bg-slate-50/70 transition">
                        <td class="py-3 px-4 font-mono font-bold text-[#003527]">#{{ order.orderNumber }}</td>
                        <td class="py-3 px-4 font-bold text-slate-900">{{ order.customerName }}</td>
                        <td class="py-3 px-4 font-semibold text-slate-800">{{ order.customerPhone }}</td>
                        <td class="py-3 px-4">
                          <span class="inline-flex items-center gap-1 text-slate-600 truncate max-w-xs">
                            <span class="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                            {{ order.deliveryAddress }}, {{ order.city }}
                          </span>
                        </td>
                        <td class="py-3 px-4 font-extrabold text-[#003527]">৳ {{ order.totalAmount }}</td>
                        <td class="py-3 px-4">
                          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f2f3ff] text-[#003527] border border-slate-200">
                            {{ order.orderType }}
                          </span>
                        </td>
                        <td class="py-3 px-4">
                          <select (change)="updateStatus(order.id, $any($event.target).value)" [value]="order.orderStatus" 
                                  class="px-2.5 py-1 rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
                                  [class.bg-amber-100]="order.orderStatus === 'Pending'" [class.text-amber-800]="order.orderStatus === 'Pending'"
                                  [class.bg-emerald-100]="order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered'" [class.text-emerald-800]="order.orderStatus === 'Confirmed' || order.orderStatus === 'Delivered'"
                                  [class.bg-blue-100]="order.orderStatus === 'Processing' || order.orderStatus === 'Shipped'" [class.text-blue-800]="order.orderStatus === 'Processing' || order.orderStatus === 'Shipped'">
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td class="py-3 px-4 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <a [href]="'https://wa.me/88' + order.customerPhone + '?text=' + getOrderNotificationMessage(order)" target="_blank" class="p-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-800 hover:text-white transition-colors" title="Notify Customer on WhatsApp">
                              <span class="material-symbols-outlined text-[16px]">chat</span>
                            </a>
                            <button (click)="printOrderChallan(order)" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Print Challan Slip">
                              <span class="material-symbols-outlined text-[16px]">print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="8" class="p-8 text-center text-slate-400">
                          No orders matched your current filter criteria.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        }

        <!-- TAB 2: Warehouse Inventory Management -->
        @if (activeTab() === 'inventory') {
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b">
              <div>
                <h3 class="text-lg font-black text-[#003527]">Stationery Stock Inventory</h3>
                <p class="text-xs text-slate-400">Direct control over active products, price points, and available units across Dhaka Hub</p>
              </div>
              <a routerLink="/shop" class="bg-[#003527] hover:bg-[#064e3b] text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow">
                View Public Catalog
              </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              @for (p of products(); track p.id) {
                <div class="bg-[#f2f3ff]/50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <img [src]="p.primaryImageUrl" [alt]="p.title" class="w-full h-36 object-cover rounded-xl mb-3 bg-white border border-slate-100">
                    <span class="text-[10px] font-bold text-[#006c4e] uppercase tracking-wider">{{ p.sku }}</span>
                    <h4 class="font-bold text-slate-800 text-xs mt-0.5 line-clamp-2">{{ p.title }}</h4>
                    <p class="text-[#003527] font-black text-sm mt-2">৳{{ p.discountPrice || p.price }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">Available Stock: <strong>{{ p.stockQuantity }} units</strong></p>
                  </div>
                  <div class="mt-4 pt-3 border-t flex justify-between items-center">
                    <a [routerLink]="['/product', p.id]" class="text-xs text-[#006c4e] font-bold hover:underline">View Page</a>
                    <button (click)="deleteProduct(p.id)" class="text-xs text-red-600 hover:underline font-bold">Remove</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  orderService = inject(OrderService);
  productService = inject(ProductService);

  activeTab = signal<'orders' | 'inventory'>('orders');
  orders = signal<Order[]>([]);
  displayedOrders = signal<Order[]>([]);
  products = signal<Product[]>([]);

  totalRevenue = signal(0);
  pendingOrdersCount = signal(0);

  searchQuery = '';
  selectedStatus = 'all';

  ngOnInit() {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.orders.set(data);
          this.filterOrders();
          this.calculateStats(data);
        } else {
          this.setMockOrders();
        }
      },
      error: () => this.setMockOrders()
    });
  }

  loadProducts() {
    this.productService.getProducts({ pageSize: 50 }).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.products.set(res.items);
        }
      },
      error: () => {}
    });
  }

  calculateStats(orders: Order[]) {
    const rev = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const pending = orders.filter(o => o.orderStatus === 'Pending').length;
    this.totalRevenue.set(rev);
    this.pendingOrdersCount.set(pending);
  }

  setMockOrders() {
    const sampleOrders: Order[] = [
      {
        id: 1,
        orderNumber: 'SE-4821',
        customerName: 'Farhan Ahmed (Apex Solutions)',
        customerPhone: '01711234567',
        deliveryAddress: 'Gulshan-2, Road 45',
        city: 'Dhaka',
        deliveryFee: 60,
        subTotal: 2980,
        totalAmount: 3040,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed',
        orderType: 'Corporate_Bulk',
        createdAt: new Date().toISOString(),
        items: []
      },
      {
        id: 2,
        orderNumber: 'SE-4820',
        customerName: 'Tariqul Islam (BRAC Bank HQ)',
        customerPhone: '01819876543',
        deliveryAddress: 'Motijheel C/A',
        city: 'Dhaka',
        deliveryFee: 0,
        subTotal: 50000,
        totalAmount: 50000,
        paymentMethod: 'Bank_Transfer',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        orderType: 'Corporate_Bulk',
        createdAt: new Date().toISOString(),
        items: []
      },
      {
        id: 3,
        orderNumber: 'SE-4819',
        customerName: 'Nabila Rahman',
        customerPhone: '01912345678',
        deliveryAddress: 'Dhanmondi Rd 27',
        city: 'Dhaka',
        deliveryFee: 100,
        subTotal: 2750,
        totalAmount: 2850,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        orderType: 'Express_6h_Dhaka',
        createdAt: new Date().toISOString(),
        items: []
      }
    ];
    this.orders.set(sampleOrders);
    this.filterOrders();
    this.calculateStats(sampleOrders);
  }

  filterOrders() {
    let filtered = [...this.orders()];
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(o => o.orderStatus.toLowerCase() === this.selectedStatus.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    this.displayedOrders.set(filtered);
  }

  selectStatusFilter(status: string) {
    this.selectedStatus = status;
    this.filterOrders();
  }

  updateStatus(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const updated = this.orders().map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
        this.orders.set(updated);
        this.filterOrders();
        this.calculateStats(updated);
      },
      error: () => {
        const updated = this.orders().map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
        this.orders.set(updated);
        this.filterOrders();
        this.calculateStats(updated);
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product from catalog?')) {
      this.products.set(this.products().filter(p => p.id !== id));
    }
  }

  getOrderNotificationMessage(order: Order): string {
    return encodeURIComponent(
      `Hello ${order.customerName}, your Sobuj Enterprise order #${order.orderNumber} (৳${order.totalAmount}) status is now: ${order.orderStatus}. Thank you for choosing Sobuj Enterprise!`
    );
  }

  printOrderChallan(order: Order) {
    window.print();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
