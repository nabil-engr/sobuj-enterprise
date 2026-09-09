import { Routes } from "@angular/router";
import { adminGuard } from "../../core/guards/auth.guard";
export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./AdminControlCenterComponent").then(
        (m) => m.AdminControlCenterComponent,
      ),
  },
];
