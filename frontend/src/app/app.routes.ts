import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/shop/shop.routes").then((m) => m.SHOP_ROUTES),
  },
  {
    path: "checkout",
    loadChildren: () =>
      import("./features/checkout/checkout.routes").then(
        (m) => m.CHECKOUT_ROUTES,
      ),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.routes").then((m) => m.AUTH_ROUTES),
  },
  {
    path: "account",
    loadChildren: () =>
      import("./features/account/account.routes").then((m) => m.ACCOUNT_ROUTES),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
  { path: "**", redirectTo: "" },
];
