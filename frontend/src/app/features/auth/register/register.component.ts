// ============================================================================
// Sobuj Enterprise - Auth Feature (Login & Registration)
// ============================================================================

import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-auth-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phoneNumber: ["", [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .register({
        fullName: this.registerForm.value.fullName!,
        email: this.registerForm.value.email!,
        phoneNumber: this.registerForm.value.phoneNumber!,
        password: this.registerForm.value.password!,
        role: "Customer",
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(["/shop"]);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || "Registration failed.");
        },
      });
  }
}

// ----------------------------------------------------------------------------
// Dedicated User Account & Order Tracking Portal
// ----------------------------------------------------------------------------
import { OrderService } from "../../../core/services/order.service";

type AccountTab = "orders" | "profile" | "address";
