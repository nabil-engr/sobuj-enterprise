import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ShoppingPreferencesService } from "../../../core/services/shopping-preferences.service";
import { CartService } from "../../../core/services/cart.service";
import { Product } from "../../../core/models";

@Component({
  selector: "app-saved-products",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./saved-products.component.html",
  styleUrl: "./saved-products.component.css",
})
export class SavedProductsComponent {
  preferences = inject(ShoppingPreferencesService);
  cart = inject(CartService);
}
