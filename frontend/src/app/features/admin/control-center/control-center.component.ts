import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";
import { AdminApiService } from "../services/admin-api.service";
import {
  AdminListItem,
  AdminMenuItem,
  AdminUser,
  Brand,
  Category,
  FilterAttribute,
  ProductDraft,
  SimpleDraft,
  WhatsAppTemplate,
} from "../models/admin.models";
import { OrderService } from "../../../core/services/order.service";
import { ProductService } from "../../../core/services/product.service";
import { Order, Product } from "../../../core/models";

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
  templateUrl: "./control-center.component.html",
  styleUrl: "./control-center.component.css",
})
export class AdminControlCenterComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private ordersApi = inject(OrderService);
  private productsApi = inject(ProductService);
  private auth = inject(AuthService);
  private router = inject(Router);
  section = signal<Section>("overview");
  message = signal("");
  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  filters = signal<FilterAttribute[]>([]);
  templates = signal<WhatsAppTemplate[]>([]);
  users = signal<AdminUser[]>([]);
  productFormOpen = signal(false);
  imageUploading = signal(false);
  savingProduct = signal(false);
  formError = signal("");
  editingProductId: number | null = null;
  productDraft: ProductDraft = this.emptyProduct();
  wholesaleTiers: { minQuantity: number; unitPrice: number }[] = [];
  brandSaving = signal(false);
  brandDraft: Brand = this.emptyBrand();
  simpleSaving = signal(false);
  simpleDraft: SimpleDraft = this.emptySimple();
  menu: AdminMenuItem[] = [
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
  get currentSimpleItems(): AdminListItem[] {
    return this.section() === "categories"
      ? this.categories()
      : this.section() === "brands"
        ? this.brands()
        : (this.filters() as AdminListItem[]);
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
  load<T>(path: string, target: WritableSignal<T[]>) {
    this.adminApi
      .list<T>(path)
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
  emptyProduct(): ProductDraft {
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
  emptyBrand(): Brand {
    return {
      id: 0,
      name: "",
      slug: "",
      logoUrl: "",
      website: "",
      isFeatured: true,
    };
  }
  emptySimple(): SimpleDraft {
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
  editSimple(item: AdminListItem) {
    this.simpleDraft = {
      ...this.emptySimple(),
      ...item,
      slug: item.slug || item.code || "",
      displayType:
        item.displayType === "Dropdown" || item.displayType === "ColorSwatch"
          ? item.displayType
          : "Checkbox",
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
      ? this.adminApi.update(path, this.simpleDraft.id, payload)
      : this.adminApi.create(path, payload);
    request.subscribe({
      next: () => {
        this.simpleSaving.set(false);
        this.ok(this.simpleDraft.id ? "Changes saved" : "Created");
        this.newSimple();
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
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
  editBrand(brand: Brand) {
    this.brandDraft = { ...brand };
  }
  uploadBrandLogo(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.ok("Logo must be 5 MB or smaller.");
      return;
    }
    this.brandSaving.set(true);
    this.adminApi.uploadImage(file).subscribe({
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
      ? this.adminApi.update("Brands", this.brandDraft.id, payload)
      : this.adminApi.create("Brands", payload);
    request.subscribe({
      next: () => {
        this.brandSaving.set(false);
        this.ok(this.brandDraft.id ? "Brand updated" : "Brand created");
        this.newBrand();
        this.refresh();
      },
      error: (e: HttpErrorResponse) => {
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
    this.imageUploading.set(true);
    this.adminApi.uploadImage(file).subscribe({
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
    const request: Observable<unknown> = this.editingProductId
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
      error: (e: HttpErrorResponse) => {
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
    const body: Record<string, unknown> =
      kind === "filters"
        ? {
            name,
            code: this.slug(name).replaceAll("-", "_"),
            displayType: "Checkbox",
            displayOrder: 0,
          }
        : { name, slug: this.slug(name), displayOrder: 0, isFeatured: false };
    if (kind === "brands") {
      body["logoUrl"] = prompt("Official logo image URL (optional)") || "";
      body["website"] = prompt("Official brand website (optional)") || "";
    }
    this.adminApi.create(path, body).subscribe(() => {
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
    this.adminApi
      .create("WhatsAppTemplates", {
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
  editTemplate(t: WhatsAppTemplate) {
    const messageFormat = prompt("Edit message format", t.messageFormat);
    if (messageFormat === null) return;
    this.adminApi
      .update("WhatsAppTemplates", t.id, { ...t, messageFormat })
      .subscribe(() => {
        this.ok("Template updated");
        this.refresh();
      });
  }
  toggleRole(u: AdminUser) {
    const role = u.role === "Admin" ? "Customer" : "Admin";
    if (!confirm(`Change ${u.fullName} to ${role}?`)) return;
    this.adminApi.patch("Users", u.id, { role }).subscribe(() => {
      this.ok("User role updated");
      this.refresh();
    });
  }
  remove(path: string, id: number) {
    if (
      !confirm("This action permanently deletes the selected record. Continue?")
    )
      return;
    this.adminApi.remove(path, id).subscribe({
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
