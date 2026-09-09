import { Routes } from "@angular/router";
export const CHECKOUT_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./CheckoutComponent").then((m) => m.CheckoutComponent),
  },
];
