import { Routes } from "@angular/router";
export const SHOP_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "shop",
    loadComponent: () =>
      import("./shop/shop.component").then((m) => m.ShopComponent),
  },
  {
    path: "product/:id",
    loadComponent: () =>
      import("./product-detail/product-detail.component").then((m) => m.ProductDetailComponent),
  },
  {
    path: "saved",
    loadComponent: () => import("./saved-products/saved-products.component").then((m) => m.SavedProductsComponent),
  },
];
