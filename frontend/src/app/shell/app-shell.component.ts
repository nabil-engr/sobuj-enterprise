import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../core/services/cart.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.css',
})
export class AppComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
  router = inject(Router);

  navbarSearch = '';

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  onSearch() {
    if (this.navbarSearch.trim()) {
      this.router.navigate(['/shop'], { queryParams: { search: this.navbarSearch.trim() } });
      this.navbarSearch = '';
    } else {
      this.router.navigate(['/shop']);
    }
  }
}

