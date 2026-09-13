// ============================================================================
// Sobuj Enterprise - Admin Operations Console (Faithful Stitch Design)
// ============================================================================

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order, Product } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  orderService = inject(OrderService);
  productService = inject(ProductService);

  activeTab = signal<'orders' | 'inventory'>('orders');
  orders = signal<Order[]>([]);
  displayedOrders = signal<Order[]>([]);
  products = signal<Product[]>([]);

  totalRevenue = signal(0);
  pendingOrdersCount = signal(0);

  searchQuery = '';
  selectedStatus = 'all';

  ngOnInit() {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.orders.set(data);
          this.filterOrders();
          this.calculateStats(data);
        } else {
          this.setMockOrders();
        }
      },
      error: () => this.setMockOrders()
    });
  }

  loadProducts() {
    this.productService.getProducts({ pageSize: 50 }).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.products.set(res.items);
        }
      },
      error: () => {}
    });
  }

  calculateStats(orders: Order[]) {
    const rev = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const pending = orders.filter(o => o.orderStatus === 'Pending').length;
    this.totalRevenue.set(rev);
    this.pendingOrdersCount.set(pending);
  }

  setMockOrders() {
    const sampleOrders: Order[] = [
      {
        id: 1,
        orderNumber: 'SE-4821',
        customerName: 'Farhan Ahmed (Apex Solutions)',
        customerPhone: '01711234567',
        deliveryAddress: 'Gulshan-2, Road 45',
        city: 'Dhaka',
        deliveryFee: 60,
        subTotal: 2980,
        totalAmount: 3040,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed',
        orderType: 'Corporate_Bulk',
        createdAt: new Date().toISOString(),
        items: []
      },
      {
        id: 2,
        orderNumber: 'SE-4820',
        customerName: 'Tariqul Islam (BRAC Bank HQ)',
        customerPhone: '01819876543',
        deliveryAddress: 'Motijheel C/A',
        city: 'Dhaka',
        deliveryFee: 0,
        subTotal: 50000,
        totalAmount: 50000,
        paymentMethod: 'Bank_Transfer',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        orderType: 'Corporate_Bulk',
        createdAt: new Date().toISOString(),
        items: []
      },
      {
        id: 3,
        orderNumber: 'SE-4819',
        customerName: 'Nabila Rahman',
        customerPhone: '01912345678',
        deliveryAddress: 'Dhanmondi Rd 27',
        city: 'Dhaka',
        deliveryFee: 100,
        subTotal: 2750,
        totalAmount: 2850,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        orderType: 'Express_6h_Dhaka',
        createdAt: new Date().toISOString(),
        items: []
      }
    ];
    this.orders.set(sampleOrders);
    this.filterOrders();
    this.calculateStats(sampleOrders);
  }

  filterOrders() {
    let filtered = [...this.orders()];
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(o => o.orderStatus.toLowerCase() === this.selectedStatus.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    this.displayedOrders.set(filtered);
  }

  selectStatusFilter(status: string) {
    this.selectedStatus = status;
    this.filterOrders();
  }

  updateStatus(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const updated = this.orders().map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
        this.orders.set(updated);
        this.filterOrders();
        this.calculateStats(updated);
      },
      error: () => {
        const updated = this.orders().map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
        this.orders.set(updated);
        this.filterOrders();
        this.calculateStats(updated);
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product from catalog?')) {
      this.products.set(this.products().filter(p => p.id !== id));
    }
  }

  getOrderNotificationMessage(order: Order): string {
    return encodeURIComponent(
      `Hello ${order.customerName}, your Sobuj Enterprise order #${order.orderNumber} (৳${order.totalAmount}) status is now: ${order.orderStatus}. Thank you for choosing Sobuj Enterprise!`
    );
  }

  printOrderChallan(order: Order) {
    window.print();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}


