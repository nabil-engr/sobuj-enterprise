// ============================================================================
// Sobuj Enterprise - High-Converting Stitch Checkout & WhatsApp Confirmation
// ============================================================================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderResponseDto, CreateOrderDto } from '../../core/models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="w-full bg-[#faf8ff] min-h-screen pb-16">
      
      <!-- Progress Stepper / Executive Breadcrumb -->
      <section class="w-full bg-white shadow-sm py-3 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 text-slate-500">
            <a routerLink="/shop" class="hover:text-[#003527] transition-colors flex items-center gap-1 font-semibold">
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Catalog
            </a>
            <span>/</span>
            <span class="text-slate-800 font-bold">Secure WhatsApp Checkout</span>
          </div>

          <!-- Stepper -->
          <nav class="flex items-center gap-3 font-bold">
            <div class="flex items-center gap-1 text-[#006c4e]">
              <span class="w-5 h-5 rounded-full bg-[#97f5cc] text-[#002115] flex items-center justify-center text-[10px]">✓</span>
              <span>1. Cart</span>
            </div>
            <span class="text-slate-300">›</span>
            <div class="flex items-center gap-1 text-[#003527] bg-[#eaedff] px-2.5 py-1 rounded-full">
              <span class="w-5 h-5 rounded-full bg-[#003527] text-white flex items-center justify-center text-[10px]">2</span>
              <span>2. Delivery & Contact</span>
            </div>
            <span class="text-slate-300">›</span>
            <div class="flex items-center gap-1 text-slate-400">
              <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">3</span>
              <span>3. WhatsApp Dispatch</span>
            </div>
          </nav>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 lg:px-12 py-8">
        @if (!orderPlaced()) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT COLUMN: Form Details -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              
              <!-- Distributor Guarantee Notice -->
              <div class="bg-[#b0f0d6]/30 border border-[#97f5cc] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#006c4e] text-white flex items-center justify-center font-bold flex-shrink-0">
                    <span class="material-symbols-outlined text-[24px]">verified_user</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-black text-xs text-[#003527]">30+ Years Legacy Importer & Direct Fulfillment</h4>
                      <span class="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">Est. 1994</span>
                    </div>
                    <p class="text-[11px] text-slate-600">Authenticated original goods from Double A, Pilot Japan & Deli Central Depot with 100% money-back guarantee.</p>
                  </div>
                </div>
                <span class="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-[#006c4e] shadow-sm whitespace-nowrap">
                  ⚡ Dhaka 24h Express
                </span>
              </div>

              <!-- Main Checkout Form Card -->
              <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 class="text-xl font-black text-[#003527]">Delivery & Requisition Information</h2>
                  <p class="text-xs text-slate-500 mt-0.5">Please provide delivery address and WhatsApp active phone for instant order verification.</p>
                </div>

                <!-- Requisition Channel Selector -->
                <div>
                  <label class="block font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Select Order Type</label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-[#f2f3ff] rounded-2xl">
                    <button type="button" (click)="setOrderType('Standard_COD')" 
                            [class.bg-white]="selectedOrderType === 'Standard_COD'" [class.shadow-sm]="selectedOrderType === 'Standard_COD'"
                            [class.text-[#003527]]="selectedOrderType === 'Standard_COD'" [class.font-black]="selectedOrderType === 'Standard_COD'"
                            class="py-3 px-2 rounded-xl text-center transition flex flex-col items-center justify-center text-xs text-slate-600">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px] text-[#006c4e]">person</span>
                        <span>Retail Order</span>
                      </div>
                      <span class="text-[10px] text-slate-400 mt-0.5">Cash on Delivery</span>
                    </button>

                    <button type="button" (click)="setOrderType('Express_Delivery')" 
                            [class.bg-white]="selectedOrderType === 'Express_Delivery'" [class.shadow-sm]="selectedOrderType === 'Express_Delivery'"
                            [class.text-[#003527]]="selectedOrderType === 'Express_Delivery'" [class.font-black]="selectedOrderType === 'Express_Delivery'"
                            class="py-3 px-2 rounded-xl text-center transition flex flex-col items-center justify-center text-xs text-slate-600">
                      <div class="flex items-center gap-1 text-amber-700 font-bold">
                        <span class="material-symbols-outlined text-[16px]">bolt</span>
                        <span>⚡ Urgent Express</span>
                      </div>
                      <span class="text-[10px] text-slate-400 mt-0.5">Direct Van Dispatch</span>
                    </button>

                    <button type="button" (click)="setOrderType('Corporate_Bulk')" 
                            [class.bg-white]="selectedOrderType === 'Corporate_Bulk'" [class.shadow-sm]="selectedOrderType === 'Corporate_Bulk'"
                            [class.text-[#003527]]="selectedOrderType === 'Corporate_Bulk'" [class.font-black]="selectedOrderType === 'Corporate_Bulk'"
                            class="py-3 px-2 rounded-xl text-center transition flex flex-col items-center justify-center text-xs text-slate-600">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">apartment</span>
                        <span>🏢 Institutional Bulk</span>
                      </div>
                      <span class="text-[10px] text-slate-400 mt-0.5">Printed Store Receipt</span>
                    </button>
                  </div>
                </div>

                <!-- Input Fields -->
                <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()" class="space-y-4 text-xs">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Full Name / Organization *</label>
                      <input type="text" formControlName="customerName" placeholder="e.g. Farhan Ahmed / Apex Solutions" class="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]">
                    </div>

                    <div>
                      <label class="block font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                      <input type="tel" formControlName="customerPhone" placeholder="017XXXXXXXX" class="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]">
                    </div>
                  </div>

                  <div>
                    <label class="block font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">Settlement & Payment Term</label>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button type="button" (click)="paymentMethod = 'COD'" [class.ring-2]="paymentMethod === 'COD'" class="text-left bg-[#eaedff] ring-[#006c4e] rounded-xl p-4">
                        <span class="material-symbols-outlined text-[#006c4e]">payments</span><p class="font-black mt-2">Cash on Delivery</p><p class="text-[10px] text-slate-500">Pay when goods arrive</p>
                      </button>
                      <button type="button" (click)="paymentMethod = 'Mobile_Banking'" [class.ring-2]="paymentMethod === 'Mobile_Banking'" class="text-left bg-[#eaedff] ring-[#006c4e] rounded-xl p-4">
                        <span class="material-symbols-outlined text-amber-700">account_balance_wallet</span><p class="font-black mt-2">bKash / Nagad</p><p class="text-[10px] text-slate-500">Merchant payment</p>
                      </button>
                      <button type="button" (click)="paymentMethod = 'Corporate_PO'" [class.ring-2]="paymentMethod === 'Corporate_PO'" class="text-left bg-[#eaedff] ring-[#006c4e] rounded-xl p-4">
                        <span class="material-symbols-outlined text-slate-600">business</span><p class="font-black mt-2">Corporate PO</p><p class="text-[10px] text-slate-500">For contract accounts</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Delivery Street Address / Office Floor *</label>
                    <textarea formControlName="deliveryAddress" rows="2" placeholder="Shatmatha, Thana Road, Colony or Full Address" class="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e]"></textarea>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Delivery Destination *</label>
                      <select formControlName="city" class="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#006c4e] font-semibold">
                        <option value="Bogura">Inside Bogura City (৳50 delivery / Instant Pickup)</option>
                        <option value="Dhaka">Dhaka City (৳100 delivery)</option>
                        <option value="Other Districts">Other Districts / Courier (৳120 delivery)</option>
                      </select>
                    </div>

                    <div>
                      <label class="block font-bold text-slate-700 mb-1">Special Instruction / Challan Note</label>
                      <input type="text" formControlName="customerNote" placeholder="e.g. Call before delivery, or Leave with reception" class="w-full px-3.5 py-2.5 bg-[#faf8ff] border border-slate-200 rounded-xl text-sm">
                    </div>
                  </div>

                  <button type="submit" [disabled]="checkoutForm.invalid || cart.cartItems().length === 0 || isSubmitting()" 
                          class="w-full mt-4 bg-[#003527] hover:bg-[#064e3b] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl transition transform active:scale-95 text-sm flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">send</span>
                    <span>{{ isSubmitting() ? 'Submitting Order...' : 'Confirm Order & Generate WhatsApp Dispatch →' }}</span>
                  </button>
                  @if (submissionError()) {
                    <p class="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3" role="alert">
                      {{ submissionError() }}
                    </p>
                  }
                </form>
              </div>
            </div>

            <!-- RIGHT COLUMN: Order Summary -->
            <div class="lg:col-span-5 xl:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 sticky top-28">
              <h3 class="font-black text-[#003527] text-base border-b pb-3 flex items-center justify-between">
                <span>Dispatch Summary</span>
                <span class="text-xs bg-[#f2f3ff] px-2 py-0.5 rounded-full text-slate-500 font-bold">{{ cart.totalItemsCount }} items</span>
              </h3>

              <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
                @for (item of cart.cartItems(); track item.product.id) {
                  <div class="flex justify-between items-center text-xs pb-2 border-b border-slate-50">
                    <div class="max-w-[190px]">
                      <p class="font-bold text-slate-800 truncate">{{ item.product.title }}</p>
                      <p class="text-slate-400 mt-0.5">Qty: {{ item.quantity }} × ৳{{ item.product.discountPrice || item.product.price }}</p>
                    </div>
                    <span class="font-extrabold text-slate-900">৳{{ (item.product.discountPrice || item.product.price) * item.quantity }}</span>
                  </div>
                }
              </div>

              <div class="border-t pt-3 space-y-2 text-xs text-slate-600">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span class="font-bold text-slate-900">৳{{ cart.subTotal }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Delivery Fee ({{ checkoutForm.get('city')?.value }})</span>
                  <span class="font-bold text-[#006c4e]">৳{{ deliveryFee }}</span>
                </div>
                <div class="flex justify-between text-base font-black text-[#003527] border-t pt-2">
                  <span>Total Payable</span>
                  <span>৳{{ cart.subTotal + deliveryFee }}</span>
                </div>
              </div>

              <div class="p-3 bg-[#f2f3ff] rounded-xl text-[11px] text-slate-500 space-y-1">
                <div class="flex items-center gap-1 font-bold text-[#003527]">
                  <span class="material-symbols-outlined text-[14px]">local_shipping</span>
                  <span>Fast Track Dispatch:</span>
                </div>
                <p>Orders confirmed before 2:00 PM are dispatched same day via Sobuj Enterprise logistics fleet.</p>
              </div>
            </div>

          </div>
        } @else {
          <!-- Order Success Screen & WhatsApp Dispatch -->
          <div class="bg-white p-8 md:p-12 rounded-3xl border border-emerald-100 shadow-2xl text-center max-w-xl mx-auto space-y-6">
            <div class="w-16 h-16 bg-[#97f5cc] text-[#002115] rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <div>
              <span class="bg-[#97f5cc]/60 text-[#002115] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Consignment Queued</span>
              <h2 class="text-2xl font-black text-[#003527] mt-2">Order Dispatched to Warehouse!</h2>
              <p class="text-xs text-slate-500 mt-1">Your official order number is <span class="font-mono font-bold text-[#006c4e]">#{{ orderResult?.orderNumber }}</span></p>
            </div>

            <div class="p-4 bg-[#f2f3ff] rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-1.5">
              <p><strong>Total Amount Payable:</strong> ৳{{ orderResult?.totalAmount }} (Cash on Delivery)</p>
              <p><strong>Delivery Destination:</strong> {{ checkoutForm.value.deliveryAddress }}, {{ checkoutForm.value.city }}</p>
              <p><strong>Status:</strong> Dispatched in real-time to Sobuj Enterprise Bogura Operations Console.</p>
            </div>

            <!-- Dynamic 1-Click WhatsApp Button -->
            <div class="pt-2">
              <a [href]="orderResult?.whatsAppOrderUrl" target="_blank" class="inline-flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-[#25D366]/40 transition transform hover:-translate-y-0.5 text-sm">
                <span class="text-2xl">💬</span>
                <span>Send Confirmation on WhatsApp</span>
              </a>
              <p class="text-[11px] text-slate-400 mt-2">One click opens WhatsApp with your pre-formatted order summary directly to our WhatsApp 01827-801872.</p>
            </div>
          </div>
        }
      </section>

    </div>
  `
})
export class CheckoutComponent {
  cart = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  orderPlaced = signal(false);
  isSubmitting = signal(false);
  submissionError = signal('');
  orderResult: OrderResponseDto | null = null;
  selectedOrderType = 'Standard_COD';
  paymentMethod = 'COD';

  checkoutForm = this.fb.group({
    customerName: [this.authService.currentUser()?.fullName || '', Validators.required],
    customerPhone: [this.authService.currentUser()?.phoneNumber || '', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    customerEmail: [this.authService.currentUser()?.email || ''],
    deliveryAddress: ['', Validators.required],
    city: ['Bogura', Validators.required],
    customerNote: ['']
  });

  get deliveryFee(): number {
    const destination = this.checkoutForm.get('city')?.value;
    if (destination === 'Bogura') return 50;
    if (destination === 'Dhaka') return 100;
    return 120;
  }

  setOrderType(type: string) {
    this.selectedOrderType = type;
  }

  submitOrder() {
    if (this.checkoutForm.invalid || this.cart.cartItems().length === 0) return;

    this.isSubmitting.set(true);
    this.submissionError.set('');

    const payload: CreateOrderDto = {
      customerName: this.checkoutForm.value.customerName!,
      customerPhone: this.checkoutForm.value.customerPhone!,
      customerEmail: this.checkoutForm.value.customerEmail || undefined,
      deliveryAddress: this.checkoutForm.value.deliveryAddress!,
      city: this.checkoutForm.value.city!,
      orderType: this.selectedOrderType,
      paymentMethod: this.paymentMethod,
      customerNote: this.checkoutForm.value.customerNote || undefined,
      items: this.cart.cartItems().map(i => ({
        productId: i.product.id,
        variantName: i.selectedVariant,
        quantity: i.quantity
      }))
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (res) => {
        this.orderResult = res;
        this.orderPlaced.set(true);
        this.cart.clear();
        this.isSubmitting.set(false);
      },
      error: (error) => {
        this.submissionError.set(
          error?.error?.message || 'Order submission failed. Please check your connection and try again.'
        );
        this.isSubmitting.set(false);
      }
    });
  }
}
