import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { apiBaseUrl } from "../../core/config/api.config";
import { OrderService } from "../../core/services/order.service";
import { ProductService } from "../../core/services/product.service";
import { Order, Product } from "../../core/models/models";

type Section =
  | "overview"
  | "orders"
  | "products"
  | "categories"
  | "brands"
  | "filters"
  | "templates"
  | "users"
  | "settings";

@Component({
  selector: "app-admin-control-center",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-140px)] bg-[#f6f7ff] flex">
      <aside
        class="w-64 bg-[#003527] text-white hidden lg:flex flex-col sticky top-0 h-screen"
      >
        <div class="p-5 border-b border-white/10">
          <p class="text-[10px] uppercase tracking-widest text-[#97f5cc]">
            Secure workspace
          </p>
          <h1 class="text-lg font-black">Admin Control Center</h1>
        </div>
        <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
          @for (item of menu; track item.key) {
            <button
              (click)="section.set(item.key)"
              [class.bg-white]="section() === item.key"
              [class.text-[#003527]]="section() === item.key"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition text-left"
            >
              <span class="material-symbols-outlined text-[19px]">{{
                item.icon
              }}</span
              >{{ item.label }}
              @if (item.count !== undefined) {
                <span
                  class="ml-auto rounded-full px-2 py-0.5 bg-[#97f5cc]/20"
                  >{{ item.count }}</span
                >
              }
            </button>
          }
        </nav>
        <button
          (click)="logout()"
          class="m-3 p-3 rounded-xl bg-red-500/15 text-red-200 font-bold text-xs"
        >
          Logout securely
        </button>
      </aside>

      <main class="flex-1 min-w-0 p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <div class="lg:hidden flex gap-2 overflow-x-auto pb-4">
            @for (item of menu; track item.key) {
              <button
                (click)="section.set(item.key)"
                [class.bg-[#003527]]="section() === item.key"
                [class.text-white]="section() === item.key"
                class="whitespace-nowrap bg-white border px-3 py-2 rounded-lg text-xs font-bold"
              >
                {{ item.label }}
              </button>
            }
          </div>
          <header
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-widest font-black text-[#006c4e]"
              >
                Sobuj Enterprise Operations
              </p>
              <h2 class="text-2xl font-black text-[#131b2e]">{{ title }}</h2>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="refresh()"
                class="bg-white border px-4 py-2 rounded-xl text-xs font-bold"
              >
                ↻ Refresh</button
              ><a
                routerLink="/"
                class="bg-[#003527] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >View Store</a
              >
            </div>
          </header>
          @if (message()) {
            <div
              class="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
            >
              {{ message() }}
            </div>
          }

          @if (section() === "overview") {
            <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
              @for (card of stats; track card.label) {
                <div class="bg-white rounded-2xl border p-5">
                  <span class="material-symbols-outlined text-[#006c4e]">{{
                    card.icon
                  }}</span>
                  <p class="text-3xl font-black mt-2">{{ card.value }}</p>
                  <p class="text-xs text-slate-500">{{ card.label }}</p>
                </div>
              }
            </div>
            <div class="grid lg:grid-cols-2 gap-5">
              <div class="panel">
                <h3>Quick Operations</h3>
                <div class="grid grid-cols-2 gap-3 mt-4">
                  @for (item of menu.slice(1, 7); track item.key) {
                    <button
                      (click)="section.set(item.key)"
                      class="p-4 text-left bg-[#f2f3ff] rounded-xl font-bold text-xs"
                    >
                      <span
                        class="material-symbols-outlined block text-[#006c4e] mb-1"
                        >{{ item.icon }}</span
                      >{{ item.label }}
                    </button>
                  }
                </div>
              </div>
              <div class="panel">
                <h3>Recent Orders</h3>
                <div class="mt-3 divide-y">
                  @for (o of orders().slice(0, 5); track o.id) {
                    <div class="py-3 flex justify-between text-xs">
                      <span
                        ><b>#{{ o.orderNumber }}</b
                        ><br />{{ o.customerName }}</span
                      ><span class="font-black"
                        >৳{{ o.totalAmount }}<br /><em
                          class="not-italic text-[#006c4e]"
                          >{{ o.orderStatus }}</em
                        ></span
                      >
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          @if (section() === "orders") {
            <div class="panel overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Order & time</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th class="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (o of orders(); track o.id) {
                    <tr class="order-row" (click)="viewOrder(o)">
                      <td>
                        <b class="text-[#003527]">#{{ o.orderNumber }}</b
                        ><br /><span class="muted">{{
                          o.createdAt | date: "dd MMM y, h:mm a"
                        }}</span>
                      </td>
                      <td>
                        <b>{{ o.customerName }}</b
                        ><br /><span class="muted">{{ o.customerPhone }}</span
                        ><br /><span class="muted"
                          >{{ o.city }}{{ o.area ? " · " + o.area : "" }}</span
                        >
                      </td>
                      <td>
                        <div class="max-w-72">
                          @for (item of o.items.slice(0, 2); track item.id) {
                            <p class="product-line">
                              <b>{{ item.quantity }}×</b>
                              {{ item.productTitle }}
                            </p>
                          }
                          @if (!o.items.length) {
                            <span class="muted">No item details</span>
                          }
                          @if (o.items.length > 2) {
                            <span class="more-items"
                              >+{{ o.items.length - 2 }} more</span
                            >
                          }
                          <span class="muted block mt-1"
                            >{{ totalUnits(o) }} units ·
                            {{ o.items.length }} products</span
                          >
                        </div>
                      </td>
                      <td>
                        <b>{{ paymentLabel(o.paymentMethod) }}</b
                        ><br /><span
                          class="payment-badge"
                          [class.paid]="o.paymentStatus === 'Paid'"
                          >{{ o.paymentStatus }}</span
                        >
                      </td>
                      <td>
                        <b class="text-[#003527] text-sm"
                          >৳{{ o.totalAmount.toLocaleString() }}</b
                        ><br /><span class="muted"
                          >Delivery: ৳{{ o.deliveryFee }}</span
                        >
                      </td>
                      <td (click)="$event.stopPropagation()">
                        <select
                          [value]="o.orderStatus"
                          (change)="
                            changeOrderStatus(o, $any($event.target).value)
                          "
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </td>
                      <td class="text-right">
                        <button
                          class="view-button"
                          (click)="$event.stopPropagation(); viewOrder(o)"
                        >
                          <span class="material-symbols-outlined text-[16px]"
                            >visibility</span
                          >
                          Details
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="7" class="text-center text-slate-500 py-10">
                        No orders found.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (selectedOrder(); as o) {
            <div
              class="fixed inset-0 z-[110] bg-slate-950/55 backdrop-blur-sm flex justify-end"
              (click)="closeOrderDetails()"
            >
              <section class="order-drawer" (click)="$event.stopPropagation()">
                <header class="drawer-header">
                  <div>
                    <p class="eyebrow">Order details</p>
                    <h2>#{{ o.orderNumber }}</h2>
                    <p>{{ o.createdAt | date: "EEEE, dd MMMM y · h:mm a" }}</p>
                  </div>
                  <button
                    (click)="closeOrderDetails()"
                    aria-label="Close order details"
                  >
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </header>
                <div class="drawer-body">
                  <div class="status-strip">
                    <div>
                      <span>Order status</span
                      ><strong>{{ o.orderStatus }}</strong>
                    </div>
                    <select
                      [value]="o.orderStatus"
                      (change)="changeOrderStatus(o, $any($event.target).value)"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-card">
                      <span class="material-symbols-outlined">person</span>
                      <div>
                        <small>Customer</small
                        ><strong>{{ o.customerName }}</strong
                        ><a [href]="'tel:' + o.customerPhone">{{
                          o.customerPhone
                        }}</a>
                        @if (o.customerEmail) {
                          <a [href]="'mailto:' + o.customerEmail">{{
                            o.customerEmail
                          }}</a>
                        }
                      </div>
                    </div>
                    <div class="detail-card">
                      <span class="material-symbols-outlined">location_on</span>
                      <div>
                        <small>Delivery address</small
                        ><strong>{{ o.deliveryAddress }}</strong>
                        <p>{{ o.area ? o.area + ", " : "" }}{{ o.city }}</p>
                      </div>
                    </div>
                    <div class="detail-card">
                      <span class="material-symbols-outlined">payments</span>
                      <div>
                        <small>Payment</small
                        ><strong>{{ paymentLabel(o.paymentMethod) }}</strong>
                        <p>{{ o.paymentStatus }}</p>
                      </div>
                    </div>
                    <div class="detail-card">
                      <span class="material-symbols-outlined"
                        >local_shipping</span
                      >
                      <div>
                        <small>Order type</small
                        ><strong>{{ orderTypeLabel(o.orderType) }}</strong>
                        <p>{{ totalUnits(o) }} total units</p>
                      </div>
                    </div>
                  </div>
                  <div class="items-card">
                    <div class="section-heading">
                      <div>
                        <h3>Products ordered</h3>
                        <p>
                          {{ o.items.length }} products ·
                          {{ totalUnits(o) }} units
                        </p>
                      </div>
                    </div>
                    @for (item of o.items; track item.id) {
                      <div class="order-item">
                        <div class="item-qty">{{ item.quantity }}×</div>
                        <div class="flex-1 min-w-0">
                          <strong>{{ item.productTitle }}</strong>
                          <p>
                            SKU: {{ item.productSKU
                            }}{{
                              item.variantName ? " · " + item.variantName : ""
                            }}
                          </p>
                          <span
                            >৳{{ item.unitPrice.toLocaleString() }} each</span
                          >
                        </div>
                        <b>৳{{ item.totalPrice.toLocaleString() }}</b>
                      </div>
                    } @empty {
                      <p class="empty-items">
                        No product details were supplied with this order.
                      </p>
                    }
                  </div>
                  <div class="summary-card">
                    <div>
                      <span>Subtotal</span
                      ><b>৳{{ o.subTotal.toLocaleString() }}</b>
                    </div>
                    <div>
                      <span>Delivery fee</span
                      ><b>৳{{ o.deliveryFee.toLocaleString() }}</b>
                    </div>
                    <div class="grand-total">
                      <span>Total payable</span
                      ><b>৳{{ o.totalAmount.toLocaleString() }}</b>
                    </div>
                  </div>
                  @if (o.customerNote || o.adminNote) {
                    <div class="notes-card">
                      <h3>Notes</h3>
                      @if (o.customerNote) {
                        <div>
                          <small>Customer note</small>
                          <p>{{ o.customerNote }}</p>
                        </div>
                      }
                      @if (o.adminNote) {
                        <div>
                          <small>Admin note</small>
                          <p>{{ o.adminNote }}</p>
                        </div>
                      }
                    </div>
                  }
                </div>
                <footer class="drawer-footer">
                  <a [href]="whatsAppLink(o)" target="_blank" rel="noopener"
                    ><span class="material-symbols-outlined">chat</span> Message
                    customer</a
                  ><button (click)="printOrder()">
                    <span class="material-symbols-outlined">print</span> Print
                    order
                  </button>
                </footer>
              </section>
            </div>
          }

          @if (section() === "products") {
            <div class="toolbar">
              <div>
                <strong>{{ products().length }} catalog products</strong>
                <p class="text-[11px] text-slate-500 font-normal">
                  Manage pricing, stock, media and storefront visibility
                </p>
              </div>
              <button (click)="openProductForm()">+ Add New Product</button>
            </div>
            <div class="panel overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Flags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of products(); track p.id) {
                    <tr>
                      <td class="flex items-center gap-3">
                        <img
                          [src]="p.primaryImageUrl"
                          class="w-12 h-12 object-cover rounded-lg"
                        /><b>{{ p.title }}</b>
                      </td>
                      <td>{{ p.sku }}</td>
                      <td>৳{{ p.discountPrice || p.price }}</td>
                      <td>{{ p.stockQuantity }}</td>
                      <td>
                        {{ p.isFeatured ? "Featured " : ""
                        }}{{ p.isBestSeller ? "Best seller" : "" }}
                      </td>
                      <td>
                        <button class="link" (click)="editProduct(p)">
                          Edit</button
                        ><button
                          class="danger"
                          (click)="remove('Products', p.id)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (section() === "categories" || section() === "filters") {
            <div class="grid lg:grid-cols-[360px_1fr] gap-5">
              <form (ngSubmit)="saveSimple()" class="panel space-y-3">
                <div class="flex justify-between">
                  <h3>
                    {{ simpleDraft.id ? "Edit" : "Create" }}
                    {{ singular(section()) }}
                  </h3>
                  @if (simpleDraft.id) {
                    <button type="button" class="link" (click)="newSimple()">
                      New
                    </button>
                  }
                </div>
                <label
                  >Name *<input
                    required
                    [(ngModel)]="simpleDraft.name"
                    name="simpleName"
                    placeholder="Display name" /></label
                ><label
                  >URL slug / code *<input
                    required
                    [(ngModel)]="simpleDraft.slug"
                    name="simpleSlug"
                    placeholder="auto-generated if blank"
                /></label>
                @if (section() === "categories") {
                  <label
                    >Description<textarea
                      [(ngModel)]="simpleDraft.description"
                      name="simpleDescription"
                      rows="2"
                    ></textarea></label
                  ><label
                    >Display order<input
                      type="number"
                      min="0"
                      [(ngModel)]="simpleDraft.displayOrder"
                      name="simpleOrder" /></label
                  ><label class="flex-row items-center"
                    ><input
                      type="checkbox"
                      [(ngModel)]="simpleDraft.isFeatured"
                      name="simpleFeatured"
                    />
                    Featured category</label
                  >
                } @else {
                  <label
                    >Category<select
                      [(ngModel)]="simpleDraft.categoryId"
                      name="filterCategory"
                    >
                      <option [ngValue]="null">All categories</option>
                      @for (category of categories(); track category.id) {
                        <option [ngValue]="category.id">
                          {{ category.name }}
                        </option>
                      }
                    </select></label
                  ><label
                    >Display type<select
                      [(ngModel)]="simpleDraft.displayType"
                      name="filterDisplay"
                    >
                      <option>Checkbox</option>
                      <option>Dropdown</option>
                      <option>ColorSwatch</option>
                    </select></label
                  ><label
                    >Display order<input
                      type="number"
                      min="0"
                      [(ngModel)]="simpleDraft.displayOrder"
                      name="filterOrder"
                  /></label>
                }
                <button class="primary w-full" [disabled]="simpleSaving()">
                  {{
                    simpleSaving()
                      ? "Saving..."
                      : simpleDraft.id
                        ? "Save changes"
                        : "Create"
                  }}
                </button>
              </form>
              <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                @for (x of currentSimpleItems; track x.id) {
                  <div class="panel">
                    <div class="flex justify-between gap-3">
                      <div>
                        <span
                          class="material-symbols-outlined text-[#006c4e]"
                          >{{
                            section() === "filters" ? "tune" : "category"
                          }}</span
                        >
                        <h3>{{ x.name }}</h3>
                        <p class="text-xs text-slate-500 mt-1">
                          {{ x.slug || x.code }}
                        </p>
                        <p class="text-[11px] text-emerald-700 mt-1">
                          {{
                            section() === "filters"
                              ? x.displayType +
                                " · " +
                                (x.categoryId
                                  ? "Category specific"
                                  : "All categories")
                              : x.isFeatured
                                ? "Featured"
                                : "Standard"
                          }}
                        </p>
                      </div>
                      <div class="flex flex-col gap-2">
                        <button class="link" (click)="editSimple(x)">
                          Edit</button
                        ><button
                          class="danger"
                          (click)="remove(apiName(section()), x.id)"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (section() === "brands") {
            <div class="grid lg:grid-cols-[380px_1fr] gap-5">
              <form (ngSubmit)="saveBrand()" class="panel space-y-3">
                <div class="flex justify-between items-center">
                  <h3>{{ brandDraft.id ? "Edit brand" : "Add brand" }}</h3>
                  @if (brandDraft.id) {
                    <button type="button" class="link" (click)="newBrand()">
                      New
                    </button>
                  }
                </div>
                <div
                  class="h-28 rounded-xl border border-dashed bg-slate-50 flex items-center justify-center overflow-hidden"
                >
                  @if (brandDraft.logoUrl) {
                    <img
                      [src]="brandDraft.logoUrl"
                      class="h-full max-w-full object-contain p-3"
                    />
                  } @else {
                    <span class="text-xs text-slate-400"
                      >Brand logo preview</span
                    >
                  }
                </div>
                <label
                  >Brand name *<input
                    required
                    [(ngModel)]="brandDraft.name"
                    name="brandName"
                    placeholder="e.g. Double A" /></label
                ><label
                  >Website<input
                    [(ngModel)]="brandDraft.website"
                    name="brandWebsite"
                    placeholder="https://brand.com" /></label
                ><label
                  >Logo image URL<input
                    [(ngModel)]="brandDraft.logoUrl"
                    name="brandLogo"
                    placeholder="https://..." /></label
                ><label
                  class="block bg-[#003527] text-white text-center rounded-xl p-3 cursor-pointer"
                  >Upload logo image<input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    class="hidden"
                    (change)="uploadBrandLogo($event)" /></label
                ><label class="flex-row items-center"
                  ><input
                    type="checkbox"
                    [(ngModel)]="brandDraft.isFeatured"
                    name="brandFeatured"
                  />
                  Show on storefront</label
                ><button class="primary w-full" [disabled]="brandSaving()">
                  {{
                    brandSaving()
                      ? "Saving..."
                      : brandDraft.id
                        ? "Save brand"
                        : "Create brand"
                  }}
                </button>
              </form>
              <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                @for (brand of brands(); track brand.id) {
                  <div class="panel">
                    <div class="flex gap-3">
                      <div
                        class="w-16 h-16 rounded-xl bg-slate-50 border flex items-center justify-center shrink-0 overflow-hidden"
                      >
                        @if (brand.logoUrl) {
                          <img
                            [src]="brand.logoUrl"
                            class="max-h-full max-w-full object-contain p-2"
                          />
                        } @else {
                          <span class="text-xs text-slate-400">No logo</span>
                        }
                      </div>
                      <div class="min-w-0">
                        <h3 class="truncate">{{ brand.name }}</h3>
                        <p class="text-[11px] text-slate-500 truncate">
                          {{ brand.website || "No website added" }}
                        </p>
                        <p class="text-[11px] text-emerald-700 mt-1">
                          {{
                            brand.isFeatured
                              ? "Visible on storefront"
                              : "Hidden from storefront"
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="mt-4 flex gap-3">
                      <button class="link" (click)="editBrand(brand)">
                        Edit</button
                      ><button
                        class="danger"
                        (click)="remove('Brands', brand.id)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (section() === "templates") {
            <div class="toolbar">
              <span>Dynamic WhatsApp messages</span
              ><button (click)="createTemplate()">+ Add Template</button>
            </div>
            <div class="grid lg:grid-cols-2 gap-4">
              @for (t of templates(); track t.id) {
                <div class="panel">
                  <div class="flex justify-between">
                    <div>
                      <span class="badge">{{ t.templateType }}</span>
                      <h3 class="mt-2">{{ t.title }}</h3>
                    </div>
                    <button
                      class="danger"
                      (click)="remove('WhatsAppTemplates', t.id)"
                    >
                      Delete
                    </button>
                  </div>
                  <pre
                    class="mt-4 whitespace-pre-wrap text-xs bg-[#f2f3ff] rounded-xl p-4 max-h-52 overflow-auto"
                    >{{ t.messageFormat }}</pre
                  >
                  <button class="link mt-3" (click)="editTemplate(t)">
                    Edit template
                  </button>
                </div>
              }
            </div>
          }

          @if (section() === "users") {
            <div class="panel overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of users(); track u.id) {
                    <tr>
                      <td>
                        <b>{{ u.fullName }}</b>
                      </td>
                      <td>{{ u.email }}</td>
                      <td>{{ u.phoneNumber || "—" }}</td>
                      <td>
                        <span class="badge">{{ u.role }}</span>
                      </td>
                      <td>{{ u.createdAt | date: "mediumDate" }}</td>
                      <td>
                        <button class="link" (click)="toggleRole(u)">
                          Make
                          {{
                            u.role === "Admin" ? "Customer" : "Admin"
                          }}</button
                        ><button class="danger" (click)="remove('Users', u.id)">
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (section() === "settings") {
            <div class="grid lg:grid-cols-2 gap-5">
              <div class="panel">
                <h3>Store Configuration</h3>
                <div class="space-y-4 mt-4">
                  <label>Store phone<input value="01827-801872" /></label
                  ><label>Support hotline<input value="01712-204763" /></label
                  ><label
                    >Dhaka delivery fee<input
                      type="number"
                      value="100" /></label
                  ><label
                    >Bogura delivery fee<input
                      type="number"
                      value="50" /></label
                  ><button
                    (click)="
                      message.set(
                        'Settings saved locally. Environment-backed settings endpoint can be connected for deployment.'
                      )
                    "
                    class="primary"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
              <div class="panel">
                <h3>Security</h3>
                <p class="text-xs text-slate-500 mt-2">
                  This console is protected by JWT Admin role. Public navigation
                  does not expose the admin URL.
                </p>
                <button (click)="logout()" class="danger mt-5">
                  Sign out all current access
                </button>
              </div>
            </div>
          }

          @if (productFormOpen()) {
            <div
              class="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 md:p-8"
              (click)="closeProductForm()"
            >
              <form
                (ngSubmit)="saveProduct()"
                (click)="$event.stopPropagation()"
                class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden"
              >
                <div
                  class="bg-[#003527] text-white p-5 md:px-8 flex justify-between items-center"
                >
                  <div>
                    <p
                      class="text-[10px] text-[#97f5cc] uppercase tracking-widest"
                    >
                      Catalog Management
                    </p>
                    <h2 class="text-xl font-black">
                      {{
                        editingProductId ? "Edit Product" : "Upload New Product"
                      }}
                    </h2>
                  </div>
                  <button
                    type="button"
                    (click)="closeProductForm()"
                    class="text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div class="grid lg:grid-cols-3 gap-7 p-5 md:p-8">
                  <div class="space-y-4">
                    <div
                      class="aspect-square bg-[#f2f3ff] border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden flex items-center justify-center relative"
                    >
                      @if (productDraft.primaryImageUrl) {
                        <img
                          [src]="productDraft.primaryImageUrl"
                          class="w-full h-full object-contain p-3"
                        />
                      } @else {
                        <div class="text-center text-slate-400">
                          <span class="material-symbols-outlined text-5xl"
                            >add_photo_alternate</span
                          >
                          <p class="text-xs font-bold">Product image preview</p>
                        </div>
                      }
                      @if (imageUploading()) {
                        <div
                          class="absolute inset-0 bg-white/80 flex items-center justify-center font-bold text-xs"
                        >
                          Uploading image...
                        </div>
                      }
                    </div>
                    <label
                      class="block bg-[#003527] text-white text-center rounded-xl p-3 cursor-pointer"
                      >Choose product image<input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        class="hidden"
                        (change)="uploadImage($event)"
                    /></label>
                    <p class="text-[10px] text-slate-500">
                      JPG, PNG, WEBP or GIF. Maximum 5 MB.
                    </p>
                    <label
                      >Or image URL<input
                        [(ngModel)]="productDraft.primaryImageUrl"
                        name="primaryImageUrl"
                        placeholder="https://..."
                    /></label>
                  </div>
                  <div
                    class="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start"
                  >
                    <label class="sm:col-span-2"
                      >Product title *<input
                        required
                        [(ngModel)]="productDraft.title"
                        name="title"
                        placeholder="e.g. Double A Copier Paper A4 80 GSM"
                    /></label>
                    <label
                      >SKU *<input
                        required
                        [(ngModel)]="productDraft.sku"
                        name="sku"
                        placeholder="PAP-DBL-A4-80"
                    /></label>
                    <label
                      >Slug<input
                        [(ngModel)]="productDraft.slug"
                        name="slug"
                        placeholder="Automatically generated if blank"
                    /></label>
                    <label
                      >Category *<select
                        required
                        [(ngModel)]="productDraft.categoryId"
                        name="categoryId"
                      >
                        <option [ngValue]="0" disabled>Select category</option>
                        @for (c of categories(); track c.id) {
                          <option [ngValue]="c.id">{{ c.name }}</option>
                        }
                      </select></label
                    >
                    <label
                      >Brand<select
                        [(ngModel)]="productDraft.brandId"
                        name="brandId"
                      >
                        <option [ngValue]="null">No brand</option>
                        @for (b of brands(); track b.id) {
                          <option [ngValue]="b.id">{{ b.name }}</option>
                        }
                      </select></label
                    >
                    <label
                      >Regular price (৳) *<input
                        required
                        min="0"
                        type="number"
                        [(ngModel)]="productDraft.price"
                        name="price"
                    /></label>
                    <label
                      >Discount price (৳)<input
                        min="0"
                        type="number"
                        [(ngModel)]="productDraft.discountPrice"
                        name="discountPrice"
                    /></label>
                    <div
                      class="sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4"
                    >
                      <div class="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p class="text-xs font-black text-[#003527]">
                            Wholesale price options
                          </p>
                          <p class="text-[11px] text-slate-500 font-normal">
                            Add a lower per-unit price for bulk quantities.
                          </p>
                        </div>
                        <button
                          type="button"
                          (click)="addWholesaleTier()"
                          class="px-3 py-2 rounded-lg bg-[#003527] text-white text-xs font-bold"
                        >
                          + Add price tier
                        </button>
                      </div>
                      @if (!wholesaleTiers.length) {
                        <p class="text-xs text-slate-500 py-2">
                          No wholesale option yet. Retail price will apply.
                        </p>
                      }
                      <div class="space-y-2">
                        @for (tier of wholesaleTiers; track $index) {
                          <div
                            class="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
                          >
                            <label class="text-[11px]"
                              >Minimum quantity<input
                                type="number"
                                min="1"
                                [(ngModel)]="tier.minQuantity"
                                [name]="'tierQty' + $index"
                                placeholder="e.g. 12" /></label
                            ><label class="text-[11px]"
                              >Wholesale price / unit (৳)<input
                                type="number"
                                min="1"
                                [(ngModel)]="tier.unitPrice"
                                [name]="'tierPrice' + $index"
                                placeholder="e.g. 500" /></label
                            ><button
                              type="button"
                              (click)="removeWholesaleTier($index)"
                              class="h-[42px] px-3 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    <label
                      >Stock quantity *<input
                        required
                        min="0"
                        type="number"
                        [(ngModel)]="productDraft.stockQuantity"
                        name="stockQuantity"
                    /></label>
                    <label
                      >Low stock alert<input
                        min="0"
                        type="number"
                        [(ngModel)]="productDraft.lowStockThreshold"
                        name="lowStockThreshold"
                    /></label>
                    <label class="sm:col-span-2"
                      >Short description<textarea
                        [(ngModel)]="productDraft.shortDescription"
                        name="shortDescription"
                        rows="2"
                      ></textarea>
                    </label>
                    <label class="sm:col-span-2"
                      >Full description<textarea
                        [(ngModel)]="productDraft.description"
                        name="description"
                        rows="4"
                      ></textarea>
                    </label>
                    <label class="sm:col-span-2"
                      >Search tags<input
                        [(ngModel)]="productDraft.tags"
                        name="tags"
                        placeholder="paper, a4, office, copier"
                    /></label>
                    <div
                      class="sm:col-span-2 flex flex-wrap gap-5 bg-[#f2f3ff] rounded-xl p-4 text-xs font-bold"
                    >
                      <label class="flex-row items-center"
                        ><input
                          type="checkbox"
                          [(ngModel)]="productDraft.isFeatured"
                          name="isFeatured"
                        />
                        Featured</label
                      ><label class="flex-row items-center"
                        ><input
                          type="checkbox"
                          [(ngModel)]="productDraft.isNewArrival"
                          name="isNewArrival"
                        />
                        New arrival</label
                      ><label class="flex-row items-center"
                        ><input
                          type="checkbox"
                          [(ngModel)]="productDraft.isBestSeller"
                          name="isBestSeller"
                        />
                        Best seller</label
                      >
                    </div>
                  </div>
                </div>
                @if (formError()) {
                  <p
                    class="mx-8 mb-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-bold"
                  >
                    {{ formError() }}
                  </p>
                }
                <div
                  class="border-t bg-slate-50 px-5 md:px-8 py-4 flex justify-end gap-3"
                >
                  <button
                    type="button"
                    (click)="closeProductForm()"
                    class="px-5 py-2.5 border rounded-xl font-bold text-xs"
                  >
                    Cancel</button
                  ><button
                    type="submit"
                    [disabled]="savingProduct() || imageUploading()"
                    class="primary disabled:opacity-50"
                  >
                    {{
                      savingProduct()
                        ? "Saving..."
                        : editingProductId
                          ? "Save Changes"
                          : "Publish Product"
                    }}
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .panel {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1.25rem;
      }
      .panel h3 {
        font-weight: 800;
        color: #003527;
      }
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .toolbar button,
      .primary {
        background: #003527;
        color: white;
        padding: 0.65rem 1rem;
        border-radius: 0.65rem;
        font-weight: 700;
      }
      table {
        width: 100%;
        font-size: 0.75rem;
        text-align: left;
        border-collapse: collapse;
      }
      th {
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: #f2f3ff;
      }
      th,
      td {
        padding: 0.8rem;
        border-bottom: 1px solid #edf2f7;
        vertical-align: middle;
      }
      select,
      input,
      textarea {
        width: 100%;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        padding: 0.65rem;
        background: white;
        outline: none;
      }
      select:focus,
      input:focus,
      textarea:focus {
        border-color: #006c4e;
        box-shadow: 0 0 0 3px rgba(0, 108, 78, 0.12);
      }
      .badge {
        display: inline-block;
        background: #dcfce7;
        color: #166534;
        padding: 0.25rem 0.55rem;
        border-radius: 99px;
        font-weight: 700;
        font-size: 0.68rem;
      }
      .link {
        color: #047857;
        font-weight: 700;
        margin-right: 0.75rem;
      }
      .danger {
        color: #dc2626;
        font-weight: 700;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-size: 0.75rem;
        font-weight: 700;
      }
      label input {
        font-weight: 400;
      }
      .order-row {
        cursor: pointer;
      }
      .order-row:hover {
        background: #f8fafc;
      }
      .muted {
        color: #64748b;
        font-size: 0.68rem;
      }
      .product-line {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #334155;
        margin-bottom: 0.15rem;
      }
      .more-items {
        display: inline-block;
        color: #047857;
        font-weight: 800;
        font-size: 0.68rem;
      }
      .payment-badge {
        display: inline-block;
        margin-top: 0.25rem;
        border-radius: 999px;
        padding: 0.15rem 0.45rem;
        background: #fef3c7;
        color: #92400e;
        font-size: 0.64rem;
        font-weight: 800;
      }
      .payment-badge.paid {
        background: #dcfce7;
        color: #166534;
      }
      .view-button {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        border: 1px solid #bbf7d0;
        background: #f0fdf4;
        color: #047857;
        border-radius: 0.55rem;
        padding: 0.45rem 0.65rem;
        font-weight: 800;
      }
      .view-button:hover {
        background: #003527;
        color: white;
      }
      .order-drawer {
        height: 100%;
        width: min(620px, 100%);
        background: #f8fafc;
        box-shadow: -20px 0 60px rgba(15, 23, 42, 0.22);
        display: flex;
        flex-direction: column;
        animation: slideIn 0.2s ease-out;
      }
      .drawer-header {
        background: #003527;
        color: white;
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .drawer-header .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.62rem;
        color: #97f5cc;
        font-weight: 900;
      }
      .drawer-header h2 {
        font-size: 1.25rem;
        font-weight: 900;
        margin-top: 0.2rem;
      }
      .drawer-header p {
        font-size: 0.72rem;
        color: #d1fae5;
      }
      .drawer-header button {
        display: grid;
        place-items: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
      }
      .drawer-body {
        padding: 1.25rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .status-strip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        border-radius: 0.8rem;
        padding: 0.75rem 1rem;
      }
      .status-strip span,
      .detail-card small,
      .notes-card small {
        display: block;
        color: #64748b;
        font-size: 0.64rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 800;
      }
      .status-strip strong {
        color: #065f46;
        font-size: 0.85rem;
      }
      .status-strip select {
        width: 145px;
        padding: 0.5rem;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .detail-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.8rem;
        padding: 0.9rem;
        display: flex;
        gap: 0.65rem;
      }
      .detail-card > .material-symbols-outlined {
        color: #047857;
        font-size: 1.25rem;
      }
      .detail-card strong,
      .detail-card a,
      .detail-card p {
        display: block;
        font-size: 0.75rem;
        margin-top: 0.15rem;
      }
      .detail-card a {
        color: #047857;
      }
      .items-card,
      .summary-card,
      .notes-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.9rem;
        padding: 1rem;
      }
      .section-heading {
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 0.7rem;
      }
      .section-heading h3,
      .notes-card h3 {
        font-size: 0.85rem;
        font-weight: 900;
        color: #0f172a;
      }
      .section-heading p {
        font-size: 0.68rem;
        color: #64748b;
      }
      .order-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.8rem 0;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.75rem;
      }
      .order-item:last-child {
        border-bottom: 0;
      }
      .item-qty {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 0.6rem;
        background: #ecfdf5;
        color: #047857;
        font-weight: 900;
        display: grid;
        place-items: center;
        flex: none;
      }
      .order-item strong {
        display: block;
        color: #0f172a;
      }
      .order-item p,
      .order-item span {
        font-size: 0.66rem;
        color: #64748b;
      }
      .empty-items {
        font-size: 0.75rem;
        color: #64748b;
        padding-top: 1rem;
      }
      .summary-card > div {
        display: flex;
        justify-content: space-between;
        padding: 0.35rem 0;
        font-size: 0.75rem;
      }
      .summary-card .grand-total {
        border-top: 1px solid #cbd5e1;
        margin-top: 0.4rem;
        padding-top: 0.8rem;
        font-size: 0.95rem;
        color: #003527;
      }
      .notes-card > div {
        background: #f8fafc;
        border-radius: 0.6rem;
        padding: 0.7rem;
        margin-top: 0.6rem;
      }
      .notes-card p {
        font-size: 0.74rem;
        color: #334155;
        margin-top: 0.2rem;
      }
      .drawer-footer {
        margin-top: auto;
        background: white;
        border-top: 1px solid #e2e8f0;
        padding: 1rem 1.25rem;
        display: flex;
        gap: 0.65rem;
      }
      .drawer-footer a,
      .drawer-footer button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        flex: 1;
        padding: 0.7rem;
        border-radius: 0.65rem;
        font-size: 0.75rem;
        font-weight: 800;
      }
      .drawer-footer a {
        background: #16a34a;
        color: white;
      }
      .drawer-footer button {
        border: 1px solid #cbd5e1;
        color: #334155;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @media (max-width: 640px) {
        .detail-grid {
          grid-template-columns: 1fr;
        }
        .drawer-body {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class AdminControlCenterComponent implements OnInit {
  private http = inject(HttpClient);
  private ordersApi = inject(OrderService);
  private productsApi = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  section = signal<Section>("overview");
  message = signal("");
  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  brands = signal<any[]>([]);
  filters = signal<any[]>([]);
  templates = signal<any[]>([]);
  users = signal<any[]>([]);
  productFormOpen = signal(false);
  imageUploading = signal(false);
  savingProduct = signal(false);
  formError = signal("");
  editingProductId: number | null = null;
  productDraft: any = this.emptyProduct();
  wholesaleTiers: { minQuantity: number; unitPrice: number }[] = [];
  brandSaving = signal(false);
  brandDraft: any = this.emptyBrand();
  simpleSaving = signal(false);
  simpleDraft: any = this.emptySimple();
  menu: any[] = [
    { key: "overview", label: "Overview", icon: "dashboard" },
    { key: "orders", label: "Orders & Dispatch", icon: "receipt_long" },
    { key: "products", label: "Products & Inventory", icon: "inventory_2" },
    { key: "categories", label: "Categories", icon: "category" },
    { key: "brands", label: "Brands", icon: "verified" },
    { key: "filters", label: "Smart Filters", icon: "filter_alt" },
    { key: "templates", label: "WhatsApp Templates", icon: "chat" },
    { key: "users", label: "Users & Roles", icon: "manage_accounts" },
    { key: "settings", label: "Store Settings", icon: "settings" },
  ];
  ngOnInit() {
    this.refresh();
  }
  get title() {
    return this.menu.find((x) => x.key === this.section())?.label || "Admin";
  }
  get stats() {
    return [
      {
        label: "Gross revenue",
        value:
          "৳" +
          this.orders()
            .reduce((a, o) => a + o.totalAmount, 0)
            .toLocaleString(),
        icon: "payments",
      },
      {
        label: "Pending orders",
        value: this.orders().filter((o) => o.orderStatus === "Pending").length,
        icon: "local_shipping",
      },
      {
        label: "Catalog products",
        value: this.products().length,
        icon: "inventory",
      },
      { label: "Registered users", value: this.users().length, icon: "group" },
    ];
  }
  get currentSimpleItems() {
    return this.section() === "categories"
      ? this.categories()
      : this.section() === "brands"
        ? this.brands()
        : this.filters();
  }
  refresh() {
    this.ordersApi.getOrders().subscribe((x) => this.orders.set(x));
    this.productsApi.getAdminProducts().subscribe((x) => this.products.set(x));
    this.load("Categories", this.categories);
    this.load("Brands", this.brands);
    this.load("Filters", this.filters);
    this.load("WhatsAppTemplates", this.templates);
    this.load("Users", this.users);
  }
  load(path: string, target: any) {
    this.http
      .get<any[]>(`${apiBaseUrl}/${path}`)
      .subscribe({ next: (x) => target.set(x), error: () => target.set([]) });
  }
  changeOrderStatus(o: Order, status: string) {
    this.ordersApi.updateOrderStatus(o.id, status).subscribe(() => {
      o.orderStatus = status;
      this.orders.set([...this.orders()]);
      if (this.selectedOrder()?.id === o.id) this.selectedOrder.set({ ...o });
      this.ok("Order status updated");
    });
  }
  viewOrder(order: Order) {
    this.selectedOrder.set(order);
    document.body.style.overflow = "hidden";
  }
  closeOrderDetails() {
    this.selectedOrder.set(null);
    document.body.style.overflow = "";
  }
  totalUnits(order: Order) {
    return (order.items || []).reduce((sum, item) => sum + item.quantity, 0);
  }
  paymentLabel(method: string) {
    const labels: Record<string, string> = {
      COD: "Cash on delivery",
      Cash_On_Delivery: "Cash on delivery",
      Bank_Transfer: "Bank transfer",
      Bkash: "bKash",
      Nagad: "Nagad",
      Card: "Card",
    };
    return labels[method] || method?.replaceAll("_", " ") || "Not specified";
  }
  orderTypeLabel(type: string) {
    return type?.replaceAll("_", " ") || "Standard order";
  }
  whatsAppLink(order: Order) {
    let phone = order.customerPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "88" + phone;
    const text = encodeURIComponent(
      `Hello ${order.customerName}, regarding your Sobuj Enterprise order #${order.orderNumber} (৳${order.totalAmount.toLocaleString()}), current status: ${order.orderStatus}.`,
    );
    return `https://wa.me/${phone}?text=${text}`;
  }
  printOrder() {
    window.print();
  }
  emptyProduct() {
    return {
      title: "",
      slug: "",
      sku: "",
      shortDescription: "",
      description: "",
      price: 0,
      discountPrice: null,
      wholesaleTiersJson: "",
      stockQuantity: 0,
      lowStockThreshold: 5,
      categoryId: 0,
      brandId: null,
      primaryImageUrl: "",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      rating: 5,
      reviewCount: 0,
      tags: "",
    };
  }
  emptyBrand() {
    return {
      id: 0,
      name: "",
      slug: "",
      logoUrl: "",
      website: "",
      isFeatured: true,
    };
  }
  emptySimple() {
    return {
      id: 0,
      name: "",
      slug: "",
      description: "",
      displayOrder: 0,
      isFeatured: false,
      categoryId: null,
      displayType: "Checkbox",
    };
  }
  newSimple() {
    this.simpleDraft = this.emptySimple();
  }
  editSimple(item: any) {
    this.simpleDraft = {
      ...this.emptySimple(),
      ...item,
      slug: item.slug || item.code || "",
    };
  }
  saveSimple() {
    const isFilter = this.section() === "filters";
    if (!this.simpleDraft.name?.trim()) {
      this.ok("Name is required.");
      return;
    }
    const slug =
      this.simpleDraft.slug?.trim() || this.slug(this.simpleDraft.name);
    const payload = isFilter
      ? {
          ...this.simpleDraft,
          code: slug.replaceAll("-", "_"),
          slug: undefined,
        }
      : { ...this.simpleDraft, slug, code: undefined };
    this.simpleSaving.set(true);
    const path = isFilter ? "Filters" : "Categories";
    const request = this.simpleDraft.id
      ? this.http.put(`${apiBaseUrl}/${path}/${this.simpleDraft.id}`, payload)
      : this.http.post(`${apiBaseUrl}/${path}`, payload);
    request.subscribe({
      next: () => {
        this.simpleSaving.set(false);
        this.ok(this.simpleDraft.id ? "Changes saved" : "Created");
        this.newSimple();
        this.refresh();
      },
      error: (e: any) => {
        this.simpleSaving.set(false);
        this.ok(
          e?.error?.message ||
            "Could not save. Check the name and unique slug.",
        );
      },
    });
  }
  newBrand() {
    this.brandDraft = this.emptyBrand();
  }
  editBrand(brand: any) {
    this.brandDraft = { ...brand };
  }
  uploadBrandLogo(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.ok("Logo must be 5 MB or smaller.");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    this.brandSaving.set(true);
    this.http
      .post<{ url: string }>(`${apiBaseUrl}/Uploads/product-image`, data)
      .subscribe({
        next: (r) => {
          this.brandDraft.logoUrl = r.url;
          this.brandSaving.set(false);
        },
        error: () => {
          this.ok("Logo upload failed");
          this.brandSaving.set(false);
        },
      });
  }
  saveBrand() {
    if (!this.brandDraft.name?.trim()) {
      this.ok("Brand name is required.");
      return;
    }
    const payload = {
      ...this.brandDraft,
      name: this.brandDraft.name.trim(),
      slug: this.brandDraft.slug?.trim() || this.slug(this.brandDraft.name),
      website: this.brandDraft.website || "",
      logoUrl: this.brandDraft.logoUrl || "",
    };
    this.brandSaving.set(true);
    const request = this.brandDraft.id
      ? this.http.put(`${apiBaseUrl}/Brands/${this.brandDraft.id}`, payload)
      : this.http.post(`${apiBaseUrl}/Brands`, payload);
    request.subscribe({
      next: () => {
        this.brandSaving.set(false);
        this.ok(this.brandDraft.id ? "Brand updated" : "Brand created");
        this.newBrand();
        this.refresh();
      },
      error: (e: any) => {
        this.brandSaving.set(false);
        this.ok(
          e?.error?.message || "Could not save brand. Check name and slug.",
        );
      },
    });
  }
  openProductForm() {
    this.editingProductId = null;
    this.productDraft = this.emptyProduct();
    this.wholesaleTiers = [];
    this.formError.set("");
    this.productFormOpen.set(true);
  }
  editProduct(p: Product) {
    this.editingProductId = p.id;
    this.productDraft = {
      ...this.emptyProduct(),
      ...p,
      category: p.category,
      brand: p.brand,
    };
    try {
      this.wholesaleTiers = JSON.parse(p.wholesaleTiersJson || "[]");
    } catch {
      this.wholesaleTiers = [];
    }
    this.formError.set("");
    this.productFormOpen.set(true);
  }
  addWholesaleTier() {
    this.wholesaleTiers = [
      ...this.wholesaleTiers,
      { minQuantity: 12, unitPrice: 0 },
    ];
  }
  removeWholesaleTier(index: number) {
    this.wholesaleTiers = this.wholesaleTiers.filter((_, i) => i !== index);
  }
  closeProductForm() {
    if (!this.savingProduct() && !this.imageUploading())
      this.productFormOpen.set(false);
  }
  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.formError.set("Image must be 5 MB or smaller.");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    this.imageUploading.set(true);
    this.http
      .post<{ url: string }>(`${apiBaseUrl}/Uploads/product-image`, data)
      .subscribe({
        next: (r) => {
          this.productDraft.primaryImageUrl = r.url;
          this.imageUploading.set(false);
        },
        error: (e) => {
          this.formError.set(e?.error?.message || "Image upload failed");
          this.imageUploading.set(false);
        },
      });
  }
  saveProduct() {
    this.formError.set("");
    if (
      !this.productDraft.title?.trim() ||
      !this.productDraft.sku?.trim() ||
      !this.productDraft.categoryId ||
      this.productDraft.price < 0
    ) {
      this.formError.set(
        "Title, SKU, category and a valid price are required.",
      );
      return;
    }
    if (
      this.wholesaleTiers.some(
        (t) =>
          !Number.isFinite(+t.minQuantity) ||
          !Number.isFinite(+t.unitPrice) ||
          +t.minQuantity < 1 ||
          +t.unitPrice <= 0,
      )
    ) {
      this.formError.set(
        "Enter a valid minimum quantity and wholesale unit price for every tier.",
      );
      return;
    }
    if (!this.productDraft.primaryImageUrl) {
      this.formError.set(
        "Please upload a product image or provide an image URL.",
      );
      return;
    }
    const payload = {
      ...this.productDraft,
      slug:
        this.productDraft.slug?.trim() || this.slug(this.productDraft.title),
      discountPrice: this.productDraft.discountPrice || null,
      wholesaleTiersJson: this.wholesaleTiers.length
        ? JSON.stringify(
            this.wholesaleTiers.sort((a, b) => a.minQuantity - b.minQuantity),
          )
        : null,
      category: undefined,
      brand: undefined,
    };
    this.savingProduct.set(true);
    const request: any = this.editingProductId
      ? this.productsApi.updateProduct(this.editingProductId, payload)
      : this.productsApi.createProduct(payload);
    request.subscribe({
      next: () => {
        this.savingProduct.set(false);
        this.productFormOpen.set(false);
        this.ok(
          this.editingProductId ? "Product updated" : "Product published",
        );
        this.refresh();
      },
      error: (e: any) => {
        this.savingProduct.set(false);
        this.formError.set(
          e?.error?.message ||
            "Could not save product. Check SKU/slug uniqueness.",
        );
      },
    });
  }
  createSimple(kind: string) {
    const name = prompt(`${this.singular(kind)} name`);
    if (!name) return;
    const path = this.apiName(kind);
    let body: any =
      kind === "filters"
        ? {
            name,
            code: this.slug(name).replaceAll("-", "_"),
            displayType: "Checkbox",
            displayOrder: 0,
          }
        : { name, slug: this.slug(name), displayOrder: 0, isFeatured: false };
    if (kind === "brands") {
      body.logoUrl = prompt("Official logo image URL (optional)") || "";
      body.website = prompt("Official brand website (optional)") || "";
    }
    this.http.post(`${apiBaseUrl}/${path}`, body).subscribe(() => {
      this.ok(`${name} created`);
      this.refresh();
    });
  }
  createTemplate() {
    const title = prompt("Template title");
    const templateType = prompt("Template type (unique)");
    const messageFormat = prompt(
      "Message format with {OrderId}, {CustomerName}, {ItemsList}",
    );
    if (!title || !templateType || !messageFormat) return;
    this.http
      .post(`${apiBaseUrl}/WhatsAppTemplates`, {
        title,
        templateType,
        messageFormat,
        isDefault: false,
      })
      .subscribe(() => {
        this.ok("Template created");
        this.refresh();
      });
  }
  editTemplate(t: any) {
    const messageFormat = prompt("Edit message format", t.messageFormat);
    if (messageFormat === null) return;
    this.http
      .put(`${apiBaseUrl}/WhatsAppTemplates/${t.id}`, { ...t, messageFormat })
      .subscribe(() => {
        this.ok("Template updated");
        this.refresh();
      });
  }
  toggleRole(u: any) {
    const role = u.role === "Admin" ? "Customer" : "Admin";
    if (!confirm(`Change ${u.fullName} to ${role}?`)) return;
    this.http
      .patch(`${apiBaseUrl}/Users/${u.id}/role`, { role })
      .subscribe(() => {
        this.ok("User role updated");
        this.refresh();
      });
  }
  remove(path: string, id: number) {
    if (
      !confirm("This action permanently deletes the selected record. Continue?")
    )
      return;
    this.http.delete(`${apiBaseUrl}/${path}/${id}`).subscribe({
      next: () => {
        this.ok("Record deleted");
        this.refresh();
      },
      error: (e) =>
        this.ok(e?.error?.message || "Delete failed: record may be in use"),
    });
  }
  apiName(s: string) {
    return s === "categories"
      ? "Categories"
      : s === "brands"
        ? "Brands"
        : "Filters";
  }
  singular(s: string) {
    return s.endsWith("ies") ? s.slice(0, -3) + "y" : s.slice(0, -1);
  }
  slug(v: string) {
    return v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  ok(v: string) {
    this.message.set(v);
    setTimeout(() => this.message.set(""), 3000);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(["/auth/login"]);
  }
}
