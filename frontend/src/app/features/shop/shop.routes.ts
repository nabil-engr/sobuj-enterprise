import { Routes } from "@angular/router";
export const SHOP_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./StorefrontComponents").then((m) => m.HomeComponent),
  },
  {
    path: "shop",
    loadComponent: () =>
      import("./StorefrontComponents").then((m) => m.ShopComponent),
  },
  {
    path: "product/:id",
    loadComponent: () =>
      import("./ProductDetailComponent").then((m) => m.ProductDetailComponent),
  },
];
