import { Routes } from "@angular/router";
import { adminGuard } from "../../core/guards/auth.guard";
export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    canActivate: [adminGuard],
    loadComponent: () =>
      import("./control-center/control-center.component").then(
        (m) => m.AdminControlCenterComponent,
      ),
  },
];
