// ============================================================================
// Sobuj Enterprise - Auth Feature (Login & Registration)
// ============================================================================

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-3">
          S
        </div>
        <h2 class="text-2xl font-black text-slate-900">Sign in to Sobuj Enterprise</h2>
        <p class="text-xs text-slate-400 mt-1">Access orders, tracking, and corporate discounts</p>
      </div>

      @if (errorMessage()) {
        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" formControlName="email" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow-md">
          {{ isLoading() ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t text-center text-xs text-slate-500">
        Don't have an account? 
        <a routerLink="/auth/register" class="text-emerald-700 font-bold hover:underline">Register here</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/shop']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid credentials.');
      }
    });
  }
}

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-black text-slate-900">Create Account</h2>
        <p class="text-xs text-slate-400 mt-1">Join Sobuj Enterprise for express delivery & fast orders</p>
      </div>

      @if (errorMessage()) {
        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input type="text" formControlName="fullName" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" formControlName="email" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
          <input type="tel" formControlName="phoneNumber" placeholder="017XXXXXXXX" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input type="password" formControlName="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
        </div>

        <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow-md">
          {{ isLoading() ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t text-center text-xs text-slate-500">
        Already registered? 
        <a routerLink="/auth/login" class="text-emerald-700 font-bold hover:underline">Sign in</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register({
      fullName: this.registerForm.value.fullName!,
      email: this.registerForm.value.email!,
      phoneNumber: this.registerForm.value.phoneNumber!,
      password: this.registerForm.value.password!,
      role: 'Customer'
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/shop']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed.');
      }
    });
  }
}

// ----------------------------------------------------------------------------
// Dedicated User Account & Order Tracking Portal
// ----------------------------------------------------------------------------
import { OrderService } from '../../core/services/order.service';

type AccountTab = 'orders' | 'profile' | 'address';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8ff] py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Top Breadcrumb & User Welcome Banner -->
        <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-black text-xl shadow-md">
              {{ getUserInitials() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-black text-[#131b2e]">{{ authService.currentUser()?.fullName || 'My Account' }}</h1>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {{ authService.currentUser()?.role || 'Customer' }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">{{ authService.currentUser()?.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a routerLink="/shop" class="px-4 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#003527] rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">storefront</span>
              Continue Shopping
            </a>
            <button (click)="logout()" class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-red-200">
              <span class="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        <!-- Notification Message -->
        @if (notificationMessage()) {
          <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{{ notificationMessage() }}</span>
            </div>
            <button (click)="notificationMessage.set('')" class="text-slate-400 hover:text-slate-600 text-base">×</button>
          </div>
        }

        <!-- Main Account Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Navigation Sidebar -->
          <div class="lg:col-span-4 space-y-3">
            <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <button (click)="activeTab = 'orders'" 
                      [class.bg-[#003527]]="activeTab === 'orders'" [class.text-white]="activeTab === 'orders'"
                      [class.text-slate-700]="activeTab !== 'orders'" [class.hover:bg-slate-50]="activeTab !== 'orders'"
                      class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition text-left">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[20px]">local_shipping</span>
                  <span>My Orders & Live Tracking</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px]" [ngClass]="activeTab === 'orders' ? 'bg-white/20' : 'bg-slate-100'">
                  {{ orders().length }}
                </span>
              </button>

              <button (click)="activeTab = 'profile'" 
                      [class.bg-[#003527]]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'"
                      [class.text-slate-700]="activeTab !== 'profile'" [class.hover:bg-slate-50]="activeTab !== 'profile'"
                      class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition text-left">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[20px]">person</span>
                  <span>Profile Information</span>
                </div>
              </button>

              <button (click)="activeTab = 'address'" 
                      [class.bg-[#003527]]="activeTab === 'address'" [class.text-white]="activeTab === 'address'"
                      [class.text-slate-700]="activeTab !== 'address'" [class.hover:bg-slate-50]="activeTab !== 'address'"
                      class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition text-left">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-[20px]">home_pin</span>
                  <span>Saved Address & Zone</span>
                </div>
              </button>
            </div>

            <!-- Hotline Support Box -->
            <div class="bg-gradient-to-br from-[#003527] to-[#004d38] p-5 rounded-2xl text-white shadow-md">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-amber-300 text-[20px]">support_agent</span>
                <span class="text-xs font-black uppercase text-amber-300">Need Immediate Help?</span>
              </div>
              <p class="text-[11px] text-white/80 leading-relaxed mb-3">
                For order adjustments, emergency dispatch in Bogura, or bulk corporate quotes, reach us directly:
              </p>
              <div class="flex flex-col gap-2">
                <a href="tel:01712204763" class="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-xs font-bold transition">
                  <span class="material-symbols-outlined text-[16px]">call</span>
                  <span>Hotline: 01712-204763</span>
                </a>
                <a href="https://wa.me/8801827801872" target="_blank" class="flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] px-3 py-2 rounded-xl text-xs font-bold transition text-white">
                  <span>💬</span>
                  <span>WhatsApp: 01827-801872</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Right Content Area -->
          <div class="lg:col-span-8">
            
            <!-- TAB 1: ORDERS & TRACKING -->
            @if (activeTab === 'orders') {
              <div class="space-y-4">
                <div class="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h2 class="text-base font-black text-slate-900">Order History & Status Tracker</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Track your stationery dispatches live from Bogura hub</p>
                  </div>
                  <button (click)="loadOrders()" class="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition">
                    ↻ Refresh
                  </button>
                </div>

                @if (isLoadingOrders()) {
                  <div class="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <div class="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p class="text-xs font-bold text-slate-500">Loading your orders...</p>
                  </div>
                } @else if (orders().length === 0) {
                  <div class="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <span class="material-symbols-outlined text-4xl text-slate-300">shopping_bag</span>
                    <h3 class="text-sm font-bold text-slate-800 mt-2">No Orders Placed Yet</h3>
                    <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Explore our genuine Double A paper, Pilot pens, and stationery catalog to place your first order.</p>
                    <a routerLink="/shop" class="mt-4 inline-block bg-[#003527] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
                      Browse Catalog
                    </a>
                  </div>
                } @else {
                  @for (order of orders(); track order.id) {
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:border-emerald-300">
                      
                      <!-- Header Strip -->
                      <div class="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="font-black text-sm text-[#003527]">#{{ order.orderNumber }}</span>
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black" [ngClass]="getStatusBadgeClass(order.orderStatus || order.OrderStatus)">
                              {{ order.orderStatus || order.OrderStatus }}
                            </span>
                          </div>
                          <span class="text-[11px] text-slate-400 block mt-0.5">{{ order.createdAt | date:'medium' }}</span>
                        </div>

                        <div class="text-right">
                          <span class="text-base font-black text-slate-900">৳{{ order.totalAmount || order.TotalAmount }}</span>
                          <span class="text-[11px] text-slate-500 block">Payment: {{ order.paymentMethod || order.PaymentMethod }}</span>
                        </div>
                      </div>

                      <!-- Visual Order Progress Stepper -->
                      <div class="p-4 sm:p-6 border-b border-slate-100 bg-white">
                        <div class="grid grid-cols-4 gap-2 text-center relative">
                          <div class="flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
                                 [ngClass]="getStepClass(order.orderStatus || order.OrderStatus, 'Pending')">
                              1
                            </div>
                            <span class="text-[10px] font-bold text-slate-700">Placed</span>
                          </div>
                          <div class="flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
                                 [ngClass]="getStepClass(order.orderStatus || order.OrderStatus, 'Confirmed')">
                              2
                            </div>
                            <span class="text-[10px] font-bold text-slate-700">Confirmed</span>
                          </div>
                          <div class="flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
                                 [ngClass]="getStepClass(order.orderStatus || order.OrderStatus, 'Shipped')">
                              3
                            </div>
                            <span class="text-[10px] font-bold text-slate-700">Shipped</span>
                          </div>
                          <div class="flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
                                 [ngClass]="getStepClass(order.orderStatus || order.OrderStatus, 'Delivered')">
                              4
                            </div>
                            <span class="text-[10px] font-bold text-slate-700">Delivered</span>
                          </div>
                        </div>
                      </div>

                      <!-- Order Destination & Actions -->
                      <div class="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-white">
                        <div class="text-xs text-slate-600 max-w-md">
                          <span class="font-bold text-slate-800">Delivery Address: </span>
                          <span>{{ order.deliveryAddress || order.DeliveryAddress }}, {{ order.city || order.City }}</span>
                        </div>

                        <div class="flex items-center gap-2">
                          <a [href]="getWhatsAppHelpLink(order)" target="_blank" class="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#003527] rounded-xl text-xs font-bold transition flex items-center gap-1">
                            <span>💬</span>
                            <span>WhatsApp Status</span>
                          </a>

                          @if ((order.orderStatus || order.OrderStatus) === 'Pending') {
                            <button (click)="cancelMyOrder(order.id)" class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition border border-red-200">
                              Cancel Order
                            </button>
                          }
                        </div>
                      </div>

                    </div>
                  }
                }
              </div>
            }

            <!-- TAB 2: PROFILE INFORMATION -->
            @if (activeTab === 'profile') {
              <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 class="text-lg font-black text-slate-900">Personal Information</h2>
                  <p class="text-xs text-slate-500 mt-0.5">Manage your personal details for quick stationery requisition</p>
                </div>

                <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input type="text" formControlName="fullName" class="w-full px-4 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]">
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Account Email (Permanent)</label>
                    <input type="email" [value]="authService.currentUser()?.email" disabled class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                    <input type="tel" formControlName="phoneNumber" placeholder="017XXXXXXXX" class="w-full px-4 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]">
                  </div>

                  <button type="submit" [disabled]="isSavingProfile() || profileForm.invalid" class="bg-[#003527] hover:bg-[#064e3b] text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm disabled:opacity-50">
                    {{ isSavingProfile() ? 'Saving Changes...' : 'Save Profile' }}
                  </button>
                </form>
              </div>
            }

            <!-- TAB 3: SAVED ADDRESSES -->
            @if (activeTab === 'address') {
              <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 class="text-lg font-black text-slate-900">Primary Delivery Address</h2>
                  <p class="text-xs text-slate-500 mt-0.5">Save your default Bogura or nationwide shipping location for 1-click checkout</p>
                </div>

                <form [formGroup]="addressForm" (ngSubmit)="saveAddress()" class="space-y-4 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">City / Delivery Zone</label>
                    <select formControlName="city" class="w-full px-4 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]">
                      <option value="Bogura">Inside Bogura City (৳50 delivery / Instant Pickup at Shatmatha)</option>
                      <option value="Dhaka">Dhaka Metro (Express Courier ৳100)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Other">Other Nationwide District</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Street Address, Landmark or Office Floor</label>
                    <textarea formControlName="address" rows="3" placeholder="e.g. Shatmatha New Market / Thana Road, Bogura" class="w-full px-4 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]"></textarea>
                  </div>

                  <button type="submit" class="bg-[#003527] hover:bg-[#064e3b] text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm">
                    Save Address
                  </button>
                </form>

                @if (addresses().length) {
                  <div class="border-t pt-5 space-y-2">
                    <p class="text-xs font-black text-slate-700">Saved addresses</p>
                    @for (item of addresses(); track item.id) {
                      <div class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs">
                        <div><b>{{ item.label }}</b><span class="text-slate-500"> · {{ item.addressLine }}, {{ item.city }}</span></div>
                        <button (click)="deleteAddress(item.id)" class="text-red-600 font-bold">Delete</button>
                      </div>
                    }
                  </div>
                }
              </div>
            }

          </div>

        </div>

      </div>
    </div>
  `
})
export class UserAccountComponent implements OnInit {
  authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  activeTab: AccountTab = 'orders';
  orders = signal<any[]>([]);
  addresses = signal<any[]>([]);
  isLoadingOrders = signal<boolean>(true);
  isSavingProfile = signal<boolean>(false);
  notificationMessage = signal<string>('');

  profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['']
  });

  addressForm = this.fb.group({
    city: ['Bogura'],
    address: ['']
  });

  ngOnInit(): void {
    const current = this.authService.currentUser();
    if (current) {
      this.profileForm.patchValue({
        fullName: current.fullName,
        phoneNumber: current.phoneNumber || ''
      });
    }

    const savedAddr = localStorage.getItem('sobuj_saved_address');
    if (savedAddr) {
      try {
        const parsed = JSON.parse(savedAddr);
        this.addressForm.patchValue(parsed);
      } catch {}
    }

    this.loadOrders();
    this.loadAddresses();
  }

  getUserInitials(): string {
    const name = this.authService.currentUser()?.fullName || 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  loadOrders(): void {
    this.isLoadingOrders.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data || []);
        this.isLoadingOrders.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.isLoadingOrders.set(false);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSavingProfile.set(true);

    const val = this.profileForm.value;
    this.authService.updateProfile({
      fullName: val.fullName!,
      phoneNumber: val.phoneNumber || ''
    }).subscribe({
      next: () => {
        this.isSavingProfile.set(false);
        this.notificationMessage.set('Profile successfully updated!');
      },
      error: () => {
        this.isSavingProfile.set(false);
        this.notificationMessage.set('Profile updated locally.');
      }
    });
  }

  saveAddress(): void {
    const user = this.authService.currentUser();
    const value = this.addressForm.value;
    this.authService.saveAddress({
      label: 'Delivery address', recipientName: user?.fullName || 'Customer',
      phoneNumber: user?.phoneNumber || '', addressLine: value.address || '', city: value.city || 'Bogura', isDefault: this.addresses().length === 0
    }).subscribe({next: () => { this.notificationMessage.set('Address saved.'); this.addressForm.patchValue({address: ''}); this.loadAddresses(); }, error: () => this.notificationMessage.set('Could not save address. Please add a phone number in profile first.')});
  }

  loadAddresses(): void { this.authService.getAddresses().subscribe({next: x => this.addresses.set(x), error: () => this.addresses.set([])}); }
  deleteAddress(id: number): void { if (confirm('Delete this saved address?')) this.authService.deleteAddress(id).subscribe({next: () => { this.notificationMessage.set('Address deleted.'); this.loadAddresses(); }}); }

  cancelMyOrder(orderId: number): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.notificationMessage.set('Order has been cancelled.');
        this.loadOrders();
      },
      error: (err) => {
        this.notificationMessage.set(err.error?.message || 'Order could not be cancelled.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-purple-100 text-purple-800';
      case 'Confirmed': return 'bg-amber-100 text-amber-900';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  getStepClass(orderStatus: string, stepName: string): string {
    const states = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    const orderIdx = states.indexOf(orderStatus);
    const stepIdx = states.indexOf(stepName);

    if (orderStatus === 'Cancelled') {
      return 'bg-red-100 text-red-600';
    }

    if (orderIdx >= stepIdx && orderIdx !== -1) {
      return 'bg-[#003527] text-white';
    }
    return 'bg-slate-100 text-slate-400';
  }

  getWhatsAppHelpLink(order: any): string {
    const num = order.orderNumber || order.OrderNumber;
    const tot = order.totalAmount || order.TotalAmount;
    const st = order.orderStatus || order.OrderStatus;
    const text = encodeURIComponent(`Hello Sobuj Enterprise, I am inquiring about my Order #${num} (Total: ৳${tot}, Status: ${st}). Please provide latest dispatch update.`);
    return `https://wa.me/8801827801872?text=${text}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
