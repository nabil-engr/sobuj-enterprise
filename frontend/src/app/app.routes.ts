import { Routes } from '@angular/router';
import { HomeComponent, ShopComponent } from './features/shop/StorefrontComponents';
import { ProductDetailComponent } from './features/shop/ProductDetailComponent';
import { CheckoutComponent } from './features/checkout/CheckoutComponent';
import { LoginComponent, RegisterComponent, UserAccountComponent } from './features/auth/AuthComponents';
import { AdminControlCenterComponent } from './features/admin/AdminControlCenterComponent';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'account', component: UserAccountComponent, canActivate: [authGuard] },
  { 
    path: 'admin', 
    component: AdminControlCenterComponent,
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }
];
