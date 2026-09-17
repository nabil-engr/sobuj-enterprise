// ============================================================================
// Sobuj Enterprise - Auth Feature (Login & Registration)
// ============================================================================

import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { OrderService } from "../../../core/services/order.service";
import { Order, UserAddress } from "../../../core/models";

type AccountTab = "orders" | "profile" | "address";
type AccountOrder = Order & {
  OrderNumber?: string;
  TotalAmount?: number;
  OrderStatus?: string;
  PaymentMethod?: string;
  DeliveryAddress?: string;
  City?: string;
};

@Component({
  selector: "app-user-account",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./account.component.html",
  styleUrl: "./account.component.css",
})
export class UserAccountComponent implements OnInit {
  authService = inject(AuthService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  activeTab: AccountTab = "orders";
  orders = signal<AccountOrder[]>([]);
  addresses = signal<UserAddress[]>([]);
  isLoadingOrders = signal<boolean>(true);
  isSavingProfile = signal<boolean>(false);
  notificationMessage = signal<string>("");

  profileForm = this.fb.group({
    fullName: ["", [Validators.required, Validators.minLength(2)]],
    phoneNumber: [""],
  });

  addressForm = this.fb.group({
    city: ["Bogura"],
    address: [""],
  });

  ngOnInit(): void {
    const current = this.authService.currentUser();
    if (current) {
      this.profileForm.patchValue({
        fullName: current.fullName,
        phoneNumber: current.phoneNumber || "",
      });
    }

    const savedAddr = localStorage.getItem("sobuj_saved_address");
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
    const name = this.authService.currentUser()?.fullName || "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
      },
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSavingProfile.set(true);

    const val = this.profileForm.value;
    this.authService
      .updateProfile({
        fullName: val.fullName!,
        phoneNumber: val.phoneNumber || "",
      })
      .subscribe({
        next: () => {
          this.isSavingProfile.set(false);
          this.notificationMessage.set("Profile successfully updated!");
        },
        error: () => {
          this.isSavingProfile.set(false);
          this.notificationMessage.set("Profile updated locally.");
        },
      });
  }

  saveAddress(): void {
    const user = this.authService.currentUser();
    const value = this.addressForm.value;
    this.authService
      .saveAddress({
        label: "Delivery address",
        recipientName: user?.fullName || "Customer",
        phoneNumber: user?.phoneNumber || "",
        addressLine: value.address || "",
        city: value.city || "Bogura",
        isDefault: this.addresses().length === 0,
      })
      .subscribe({
        next: () => {
          this.notificationMessage.set("Address saved.");
          this.addressForm.patchValue({ address: "" });
          this.loadAddresses();
        },
        error: () =>
          this.notificationMessage.set(
            "Could not save address. Please add a phone number in profile first.",
          ),
      });
  }

  loadAddresses(): void {
    this.authService.getAddresses().subscribe({
      next: (x) => this.addresses.set(x),
      error: () => this.addresses.set([]),
    });
  }
  deleteAddress(id: number): void {
    if (confirm("Delete this saved address?"))
      this.authService.deleteAddress(id).subscribe({
        next: () => {
          this.notificationMessage.set("Address deleted.");
          this.loadAddresses();
        },
      });
  }

  cancelMyOrder(orderId: number): void {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.notificationMessage.set("Order has been cancelled.");
        this.loadOrders();
      },
      error: (err) => {
        this.notificationMessage.set(
          err.error?.message || "Order could not be cancelled.",
        );
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-purple-100 text-purple-800";
      case "Confirmed":
        return "bg-amber-100 text-amber-900";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  }

  getStepClass(orderStatus: string, stepName: string): string {
    const states = ["Pending", "Confirmed", "Shipped", "Delivered"];
    const orderIdx = states.indexOf(orderStatus);
    const stepIdx = states.indexOf(stepName);

    if (orderStatus === "Cancelled") {
      return "bg-red-100 text-red-600";
    }

    if (orderIdx >= stepIdx && orderIdx !== -1) {
      return "bg-[#003527] text-white";
    }
    return "bg-slate-100 text-slate-400";
  }

  getWhatsAppHelpLink(order: AccountOrder): string {
    const num = order.orderNumber || order.OrderNumber;
    const tot = order.totalAmount || order.TotalAmount;
    const st = order.orderStatus || order.OrderStatus;
    const text = encodeURIComponent(
      `Hello Sobuj Enterprise, I am inquiring about my Order #${num} (Total: ৳${tot}, Status: ${st}). Please provide latest dispatch update.`,
    );
    return `https://wa.me/8801827801872?text=${text}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
