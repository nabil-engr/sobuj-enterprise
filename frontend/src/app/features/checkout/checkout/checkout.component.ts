// ============================================================================
// Sobuj Enterprise - High-Converting Stitch Checkout & WhatsApp Confirmation
// ============================================================================

import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CartService } from "../../../core/services/cart.service";
import { OrderService } from "../../../core/services/order.service";
import { AuthService } from "../../../core/services/auth.service";
import { OrderResponseDto, CreateOrderDto } from "../../../core/models";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./checkout.component.html",
  styleUrl: "./checkout.component.css",
})
export class CheckoutComponent {
  cart = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  orderPlaced = signal(false);
  isSubmitting = signal(false);
  submissionError = signal("");
  orderResult: OrderResponseDto | null = null;
  selectedOrderType = "Standard_COD";
  paymentMethod = "COD";

  checkoutForm = this.fb.group({
    customerName: [
      this.authService.currentUser()?.fullName || "",
      Validators.required,
    ],
    customerPhone: [
      this.authService.currentUser()?.phoneNumber || "",
      [Validators.required, Validators.pattern(/^[0-9]{11}$/)],
    ],
    customerEmail: [this.authService.currentUser()?.email || ""],
    deliveryAddress: ["", Validators.required],
    city: ["Bogura", Validators.required],
    customerNote: [""],
  });

  get deliveryFee(): number {
    const destination = this.checkoutForm.get("city")?.value;
    if (destination === "Bogura") return 50;
    if (destination === "Dhaka") return 100;
    return 120;
  }

  setOrderType(type: string) {
    this.selectedOrderType = type;
  }

  submitOrder() {
    if (this.checkoutForm.invalid || this.cart.cartItems().length === 0) return;

    this.isSubmitting.set(true);
    this.submissionError.set("");

    const payload: CreateOrderDto = {
      customerName: this.checkoutForm.value.customerName!,
      customerPhone: this.checkoutForm.value.customerPhone!,
      customerEmail: this.checkoutForm.value.customerEmail || undefined,
      deliveryAddress: this.checkoutForm.value.deliveryAddress!,
      city: this.checkoutForm.value.city!,
      orderType: this.selectedOrderType,
      paymentMethod: this.paymentMethod,
      customerNote: this.checkoutForm.value.customerNote || undefined,
      items: this.cart.cartItems().map((i) => ({
        productId: i.product.id,
        variantName: i.selectedVariant,
        quantity: i.quantity,
      })),
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
          error?.error?.message ||
            "Order submission failed. Please check your connection and try again.",
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
