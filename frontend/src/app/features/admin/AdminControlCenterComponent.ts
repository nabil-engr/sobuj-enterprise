import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { apiBaseUrl } from '../../core/config/api.config';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { Order, Product } from '../../core/models/models';

type Section = 'overview'|'orders'|'products'|'categories'|'brands'|'filters'|'templates'|'users'|'settings';

@Component({
  selector: 'app-admin-control-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-140px)] bg-[#f6f7ff] flex">
      <aside class="w-64 bg-[#003527] text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div class="p-5 border-b border-white/10"><p class="text-[10px] uppercase tracking-widest text-[#97f5cc]">Secure workspace</p><h1 class="text-lg font-black">Admin Control Center</h1></div>
        <nav class="p-3 space-y-1 flex-1 overflow-y-auto">
          @for (item of menu; track item.key) {
            <button (click)="section.set(item.key)" [class.bg-white]="section()===item.key" [class.text-[#003527]]="section()===item.key" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 transition text-left">
              <span class="material-symbols-outlined text-[19px]">{{ item.icon }}</span>{{ item.label }}
              @if(item.count !== undefined){<span class="ml-auto rounded-full px-2 py-0.5 bg-[#97f5cc]/20">{{ item.count }}</span>}
            </button>
          }
        </nav>
        <button (click)="logout()" class="m-3 p-3 rounded-xl bg-red-500/15 text-red-200 font-bold text-xs">Logout securely</button>
      </aside>

      <main class="flex-1 min-w-0 p-4 md:p-8">
        <div class="max-w-7xl mx-auto">
          <div class="lg:hidden flex gap-2 overflow-x-auto pb-4">
            @for(item of menu; track item.key){<button (click)="section.set(item.key)" [class.bg-[#003527]]="section()===item.key" [class.text-white]="section()===item.key" class="whitespace-nowrap bg-white border px-3 py-2 rounded-lg text-xs font-bold">{{item.label}}</button>}
          </div>
          <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
            <div><p class="text-[10px] uppercase tracking-widest font-black text-[#006c4e]">Sobuj Enterprise Operations</p><h2 class="text-2xl font-black text-[#131b2e]">{{ title }}</h2></div>
            <div class="flex items-center gap-2"><button (click)="refresh()" class="bg-white border px-4 py-2 rounded-xl text-xs font-bold">↻ Refresh</button><a routerLink="/" class="bg-[#003527] text-white px-4 py-2 rounded-xl text-xs font-bold">View Store</a></div>
          </header>
          @if(message()){<div class="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">{{message()}}</div>}

          @if(section()==='overview'){
            <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
              @for(card of stats; track card.label){<div class="bg-white rounded-2xl border p-5"><span class="material-symbols-outlined text-[#006c4e]">{{card.icon}}</span><p class="text-3xl font-black mt-2">{{card.value}}</p><p class="text-xs text-slate-500">{{card.label}}</p></div>}
            </div>
            <div class="grid lg:grid-cols-2 gap-5"><div class="panel"><h3>Quick Operations</h3><div class="grid grid-cols-2 gap-3 mt-4">@for(item of menu.slice(1,7); track item.key){<button (click)="section.set(item.key)" class="p-4 text-left bg-[#f2f3ff] rounded-xl font-bold text-xs"><span class="material-symbols-outlined block text-[#006c4e] mb-1">{{item.icon}}</span>{{item.label}}</button>}</div></div><div class="panel"><h3>Recent Orders</h3><div class="mt-3 divide-y">@for(o of orders().slice(0,5); track o.id){<div class="py-3 flex justify-between text-xs"><span><b>#{{o.orderNumber}}</b><br>{{o.customerName}}</span><span class="font-black">৳{{o.totalAmount}}<br><em class="not-italic text-[#006c4e]">{{o.orderStatus}}</em></span></div>}</div></div></div>
          }

          @if(section()==='orders'){
            <div class="panel overflow-x-auto"><table><thead><tr><th>Order</th><th>Customer</th><th>Destination</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>@for(o of orders(); track o.id){<tr><td>#{{o.orderNumber}}</td><td><b>{{o.customerName}}</b><br>{{o.customerPhone}}</td><td>{{o.deliveryAddress}}, {{o.city}}</td><td>৳{{o.totalAmount}}</td><td><span class="badge">{{o.orderStatus}}</span></td><td><select [value]="o.orderStatus" (change)="changeOrderStatus(o,$any($event.target).value)"><option>Pending</option><option>Confirmed</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td></tr>}</tbody></table></div>
          }

          @if(section()==='products'){
            <div class="toolbar"><div><strong>{{products().length}} catalog products</strong><p class="text-[11px] text-slate-500 font-normal">Manage pricing, stock, media and storefront visibility</p></div><button (click)="openProductForm()">+ Add New Product</button></div>
            <div class="panel overflow-x-auto"><table><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Flags</th><th>Actions</th></tr></thead><tbody>@for(p of products(); track p.id){<tr><td class="flex items-center gap-3"><img [src]="p.primaryImageUrl" class="w-12 h-12 object-cover rounded-lg"><b>{{p.title}}</b></td><td>{{p.sku}}</td><td>৳{{p.discountPrice||p.price}}</td><td>{{p.stockQuantity}}</td><td>{{p.isFeatured?'Featured ':''}}{{p.isBestSeller?'Best seller':''}}</td><td><button class="link" (click)="editProduct(p)">Edit</button><button class="danger" (click)="remove('Products',p.id)">Delete</button></td></tr>}</tbody></table></div>
          }

          @if(section()==='categories' || section()==='brands' || section()==='filters'){
            <div class="toolbar"><span>Manage storefront {{section()}}</span><button (click)="createSimple(section())">+ Add {{singular(section())}}</button></div>
            <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">@for(x of currentSimpleItems; track x.id){<div class="panel"><div class="flex justify-between"><div><span class="material-symbols-outlined text-[#006c4e]">folder_managed</span><h3>{{x.name}}</h3><p class="text-xs text-slate-500 mt-1">{{x.slug||x.code||x.description}}</p></div><button class="danger" (click)="remove(apiName(section()),x.id)">Delete</button></div></div>}</div>
          }

          @if(section()==='templates'){
            <div class="toolbar"><span>Dynamic WhatsApp messages</span><button (click)="createTemplate()">+ Add Template</button></div>
            <div class="grid lg:grid-cols-2 gap-4">@for(t of templates(); track t.id){<div class="panel"><div class="flex justify-between"><div><span class="badge">{{t.templateType}}</span><h3 class="mt-2">{{t.title}}</h3></div><button class="danger" (click)="remove('WhatsAppTemplates',t.id)">Delete</button></div><pre class="mt-4 whitespace-pre-wrap text-xs bg-[#f2f3ff] rounded-xl p-4 max-h-52 overflow-auto">{{t.messageFormat}}</pre><button class="link mt-3" (click)="editTemplate(t)">Edit template</button></div>}</div>
          }

          @if(section()==='users'){
            <div class="panel overflow-x-auto"><table><thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead><tbody>@for(u of users(); track u.id){<tr><td><b>{{u.fullName}}</b></td><td>{{u.email}}</td><td>{{u.phoneNumber||'—'}}</td><td><span class="badge">{{u.role}}</span></td><td>{{u.createdAt|date:'mediumDate'}}</td><td><button class="link" (click)="toggleRole(u)">Make {{u.role==='Admin'?'Customer':'Admin'}}</button><button class="danger" (click)="remove('Users',u.id)">Delete</button></td></tr>}</tbody></table></div>
          }

          @if(section()==='settings'){
            <div class="grid lg:grid-cols-2 gap-5"><div class="panel"><h3>Store Configuration</h3><div class="space-y-4 mt-4"><label>Store phone<input value="01827-801872"></label><label>Support hotline<input value="01712-204763"></label><label>Dhaka delivery fee<input type="number" value="100"></label><label>Bogura delivery fee<input type="number" value="50"></label><button (click)="message.set('Settings saved locally. Environment-backed settings endpoint can be connected for deployment.')" class="primary">Save Settings</button></div></div><div class="panel"><h3>Security</h3><p class="text-xs text-slate-500 mt-2">This console is protected by JWT Admin role. Public navigation does not expose the admin URL.</p><button (click)="logout()" class="danger mt-5">Sign out all current access</button></div></div>
          }

          @if(productFormOpen()) {
            <div class="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 md:p-8" (click)="closeProductForm()">
              <form (ngSubmit)="saveProduct()" (click)="$event.stopPropagation()" class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">
                <div class="bg-[#003527] text-white p-5 md:px-8 flex justify-between items-center"><div><p class="text-[10px] text-[#97f5cc] uppercase tracking-widest">Catalog Management</p><h2 class="text-xl font-black">{{editingProductId ? 'Edit Product' : 'Upload New Product'}}</h2></div><button type="button" (click)="closeProductForm()" class="text-2xl">×</button></div>
                <div class="grid lg:grid-cols-3 gap-7 p-5 md:p-8">
                  <div class="space-y-4">
                    <div class="aspect-square bg-[#f2f3ff] border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden flex items-center justify-center relative">
                      @if(productDraft.primaryImageUrl){<img [src]="productDraft.primaryImageUrl" class="w-full h-full object-contain p-3">} @else {<div class="text-center text-slate-400"><span class="material-symbols-outlined text-5xl">add_photo_alternate</span><p class="text-xs font-bold">Product image preview</p></div>}
                      @if(imageUploading()){<div class="absolute inset-0 bg-white/80 flex items-center justify-center font-bold text-xs">Uploading image...</div>}
                    </div>
                    <label class="block bg-[#003527] text-white text-center rounded-xl p-3 cursor-pointer">Choose product image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="hidden" (change)="uploadImage($event)"></label>
                    <p class="text-[10px] text-slate-500">JPG, PNG, WEBP or GIF. Maximum 5 MB.</p>
                    <label>Or image URL<input [(ngModel)]="productDraft.primaryImageUrl" name="primaryImageUrl" placeholder="https://..."></label>
                  </div>
                  <div class="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
                    <label class="sm:col-span-2">Product title *<input required [(ngModel)]="productDraft.title" name="title" placeholder="e.g. Double A Copier Paper A4 80 GSM"></label>
                    <label>SKU *<input required [(ngModel)]="productDraft.sku" name="sku" placeholder="PAP-DBL-A4-80"></label>
                    <label>Slug<input [(ngModel)]="productDraft.slug" name="slug" placeholder="Automatically generated if blank"></label>
                    <label>Category *<select required [(ngModel)]="productDraft.categoryId" name="categoryId"><option [ngValue]="0" disabled>Select category</option>@for(c of categories(); track c.id){<option [ngValue]="c.id">{{c.name}}</option>}</select></label>
                    <label>Brand<select [(ngModel)]="productDraft.brandId" name="brandId"><option [ngValue]="null">No brand</option>@for(b of brands(); track b.id){<option [ngValue]="b.id">{{b.name}}</option>}</select></label>
                    <label>Regular price (৳) *<input required min="0" type="number" [(ngModel)]="productDraft.price" name="price"></label>
                    <label>Discount price (৳)<input min="0" type="number" [(ngModel)]="productDraft.discountPrice" name="discountPrice"></label>
                    <div class="sm:col-span-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <div class="flex items-center justify-between gap-3 mb-3"><div><p class="text-xs font-black text-[#003527]">Wholesale price options</p><p class="text-[11px] text-slate-500 font-normal">Add a lower per-unit price for bulk quantities.</p></div><button type="button" (click)="addWholesaleTier()" class="px-3 py-2 rounded-lg bg-[#003527] text-white text-xs font-bold">+ Add price tier</button></div>
                      @if(!wholesaleTiers.length){<p class="text-xs text-slate-500 py-2">No wholesale option yet. Retail price will apply.</p>}
                      <div class="space-y-2">@for(tier of wholesaleTiers; track $index){<div class="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"><label class="text-[11px]">Minimum quantity<input type="number" min="1" [(ngModel)]="tier.minQuantity" [name]="'tierQty'+$index" placeholder="e.g. 12"></label><label class="text-[11px]">Wholesale price / unit (৳)<input type="number" min="1" [(ngModel)]="tier.unitPrice" [name]="'tierPrice'+$index" placeholder="e.g. 500"></label><button type="button" (click)="removeWholesaleTier($index)" class="h-[42px] px-3 rounded-lg border border-red-200 bg-white text-red-600 text-xs font-bold">Remove</button></div>}</div>
                    </div>
                    <label>Stock quantity *<input required min="0" type="number" [(ngModel)]="productDraft.stockQuantity" name="stockQuantity"></label>
                    <label>Low stock alert<input min="0" type="number" [(ngModel)]="productDraft.lowStockThreshold" name="lowStockThreshold"></label>
                    <label class="sm:col-span-2">Short description<textarea [(ngModel)]="productDraft.shortDescription" name="shortDescription" rows="2"></textarea></label>
                    <label class="sm:col-span-2">Full description<textarea [(ngModel)]="productDraft.description" name="description" rows="4"></textarea></label>
                    <label class="sm:col-span-2">Search tags<input [(ngModel)]="productDraft.tags" name="tags" placeholder="paper, a4, office, copier"></label>
                    <div class="sm:col-span-2 flex flex-wrap gap-5 bg-[#f2f3ff] rounded-xl p-4 text-xs font-bold"><label class="flex-row items-center"><input type="checkbox" [(ngModel)]="productDraft.isFeatured" name="isFeatured"> Featured</label><label class="flex-row items-center"><input type="checkbox" [(ngModel)]="productDraft.isNewArrival" name="isNewArrival"> New arrival</label><label class="flex-row items-center"><input type="checkbox" [(ngModel)]="productDraft.isBestSeller" name="isBestSeller"> Best seller</label></div>
                  </div>
                </div>
                @if(formError()){<p class="mx-8 mb-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-xs font-bold">{{formError()}}</p>}
                <div class="border-t bg-slate-50 px-5 md:px-8 py-4 flex justify-end gap-3"><button type="button" (click)="closeProductForm()" class="px-5 py-2.5 border rounded-xl font-bold text-xs">Cancel</button><button type="submit" [disabled]="savingProduct() || imageUploading()" class="primary disabled:opacity-50">{{savingProduct()?'Saving...':editingProductId?'Save Changes':'Publish Product'}}</button></div>
              </form>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .panel{background:white;border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem}.panel h3{font-weight:800;color:#003527}.toolbar{display:flex;justify-content:space-between;align-items:center;background:white;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem 1.25rem;margin-bottom:1rem;font-size:.8rem;font-weight:700}.toolbar button,.primary{background:#003527;color:white;padding:.65rem 1rem;border-radius:.65rem;font-weight:700}table{width:100%;font-size:.75rem;text-align:left;border-collapse:collapse}th{color:#475569;text-transform:uppercase;letter-spacing:.04em;background:#f2f3ff}th,td{padding:.8rem;border-bottom:1px solid #edf2f7;vertical-align:middle}select,input,textarea{width:100%;border:1px solid #cbd5e1;border-radius:.5rem;padding:.65rem;background:white;outline:none}select:focus,input:focus,textarea:focus{border-color:#006c4e;box-shadow:0 0 0 3px rgba(0,108,78,.12)}.badge{display:inline-block;background:#dcfce7;color:#166534;padding:.25rem .55rem;border-radius:99px;font-weight:700;font-size:.68rem}.link{color:#047857;font-weight:700;margin-right:.75rem}.danger{color:#dc2626;font-weight:700}label{display:flex;flex-direction:column;gap:.35rem;font-size:.75rem;font-weight:700}label input{font-weight:400}
  `]
})
export class AdminControlCenterComponent implements OnInit {
  private http=inject(HttpClient); private ordersApi=inject(OrderService); private productsApi=inject(ProductService); private auth=inject(AuthService); private router=inject(Router);
  section=signal<Section>('overview'); message=signal(''); orders=signal<Order[]>([]); products=signal<Product[]>([]); categories=signal<any[]>([]); brands=signal<any[]>([]); filters=signal<any[]>([]); templates=signal<any[]>([]); users=signal<any[]>([]);
  productFormOpen=signal(false); imageUploading=signal(false); savingProduct=signal(false); formError=signal(''); editingProductId:number|null=null;
  productDraft:any=this.emptyProduct(); wholesaleTiers:{minQuantity:number;unitPrice:number}[]=[];
  menu:any[]=[{key:'overview',label:'Overview',icon:'dashboard'},{key:'orders',label:'Orders & Dispatch',icon:'receipt_long'},{key:'products',label:'Products & Inventory',icon:'inventory_2'},{key:'categories',label:'Categories',icon:'category'},{key:'brands',label:'Brands',icon:'verified'},{key:'filters',label:'Smart Filters',icon:'filter_alt'},{key:'templates',label:'WhatsApp Templates',icon:'chat'},{key:'users',label:'Users & Roles',icon:'manage_accounts'},{key:'settings',label:'Store Settings',icon:'settings'}];
  ngOnInit(){this.refresh()}
  get title(){return this.menu.find(x=>x.key===this.section())?.label||'Admin'}
  get stats(){return [{label:'Gross revenue',value:'৳'+this.orders().reduce((a,o)=>a+o.totalAmount,0).toLocaleString(),icon:'payments'},{label:'Pending orders',value:this.orders().filter(o=>o.orderStatus==='Pending').length,icon:'local_shipping'},{label:'Catalog products',value:this.products().length,icon:'inventory'},{label:'Registered users',value:this.users().length,icon:'group'}]}
  get currentSimpleItems(){return this.section()==='categories'?this.categories():this.section()==='brands'?this.brands():this.filters()}
  refresh(){this.ordersApi.getOrders().subscribe(x=>this.orders.set(x));this.productsApi.getAdminProducts().subscribe(x=>this.products.set(x));this.load('Categories',this.categories);this.load('Brands',this.brands);this.load('Filters',this.filters);this.load('WhatsAppTemplates',this.templates);this.load('Users',this.users)}
  load(path:string,target:any){this.http.get<any[]>(`${apiBaseUrl}/${path}`).subscribe({next:x=>target.set(x),error:()=>target.set([])})}
  changeOrderStatus(o:Order,status:string){this.ordersApi.updateOrderStatus(o.id,status).subscribe(()=>{o.orderStatus=status;this.orders.set([...this.orders()]);this.ok('Order status updated')})}
  emptyProduct(){return{title:'',slug:'',sku:'',shortDescription:'',description:'',price:0,discountPrice:null,wholesaleTiersJson:'',stockQuantity:0,lowStockThreshold:5,categoryId:0,brandId:null,primaryImageUrl:'',isFeatured:false,isNewArrival:true,isBestSeller:false,rating:5,reviewCount:0,tags:''}}
  openProductForm(){this.editingProductId=null;this.productDraft=this.emptyProduct();this.wholesaleTiers=[];this.formError.set('');this.productFormOpen.set(true)}
  editProduct(p:Product){this.editingProductId=p.id;this.productDraft={...this.emptyProduct(),...p,category:p.category,brand:p.brand};try{this.wholesaleTiers=JSON.parse(p.wholesaleTiersJson||'[]')}catch{this.wholesaleTiers=[]}this.formError.set('');this.productFormOpen.set(true)}
  addWholesaleTier(){this.wholesaleTiers=[...this.wholesaleTiers,{minQuantity:12,unitPrice:0}]}
  removeWholesaleTier(index:number){this.wholesaleTiers=this.wholesaleTiers.filter((_,i)=>i!==index)}
  closeProductForm(){if(!this.savingProduct()&&!this.imageUploading())this.productFormOpen.set(false)}
  uploadImage(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;if(file.size>5*1024*1024){this.formError.set('Image must be 5 MB or smaller.');return}const data=new FormData();data.append('file',file);this.imageUploading.set(true);this.http.post<{url:string}>(`${apiBaseUrl}/Uploads/product-image`,data).subscribe({next:r=>{this.productDraft.primaryImageUrl=r.url;this.imageUploading.set(false)},error:e=>{this.formError.set(e?.error?.message||'Image upload failed');this.imageUploading.set(false)}})}
  saveProduct(){this.formError.set('');if(!this.productDraft.title?.trim()||!this.productDraft.sku?.trim()||!this.productDraft.categoryId||this.productDraft.price<0){this.formError.set('Title, SKU, category and a valid price are required.');return}if(this.wholesaleTiers.some(t=>!Number.isFinite(+t.minQuantity)||!Number.isFinite(+t.unitPrice)||+t.minQuantity<1||+t.unitPrice<=0)){this.formError.set('Enter a valid minimum quantity and wholesale unit price for every tier.');return}if(!this.productDraft.primaryImageUrl){this.formError.set('Please upload a product image or provide an image URL.');return}const payload={...this.productDraft,slug:this.productDraft.slug?.trim()||this.slug(this.productDraft.title),discountPrice:this.productDraft.discountPrice||null,wholesaleTiersJson:this.wholesaleTiers.length?JSON.stringify(this.wholesaleTiers.sort((a,b)=>a.minQuantity-b.minQuantity)):null,category:undefined,brand:undefined};this.savingProduct.set(true);const request:any=this.editingProductId?this.productsApi.updateProduct(this.editingProductId,payload):this.productsApi.createProduct(payload);request.subscribe({next:()=>{this.savingProduct.set(false);this.productFormOpen.set(false);this.ok(this.editingProductId?'Product updated':'Product published');this.refresh()},error:(e:any)=>{this.savingProduct.set(false);this.formError.set(e?.error?.message||'Could not save product. Check SKU/slug uniqueness.')}})}
  createSimple(kind:string){const name=prompt(`${this.singular(kind)} name`);if(!name)return;const path=this.apiName(kind);let body:any=kind==='filters'?{name,code:this.slug(name).replaceAll('-','_'),displayType:'Checkbox',displayOrder:0}:{name,slug:this.slug(name),displayOrder:0,isFeatured:false};if(kind==='brands'){body.logoUrl=prompt('Official logo image URL (optional)')||'';body.website=prompt('Official brand website (optional)')||''}this.http.post(`${apiBaseUrl}/${path}`,body).subscribe(()=>{this.ok(`${name} created`);this.refresh()})}
  createTemplate(){const title=prompt('Template title');const templateType=prompt('Template type (unique)');const messageFormat=prompt('Message format with {OrderId}, {CustomerName}, {ItemsList}');if(!title||!templateType||!messageFormat)return;this.http.post(`${apiBaseUrl}/WhatsAppTemplates`,{title,templateType,messageFormat,isDefault:false}).subscribe(()=>{this.ok('Template created');this.refresh()})}
  editTemplate(t:any){const messageFormat=prompt('Edit message format',t.messageFormat);if(messageFormat===null)return;this.http.put(`${apiBaseUrl}/WhatsAppTemplates/${t.id}`,{...t,messageFormat}).subscribe(()=>{this.ok('Template updated');this.refresh()})}
  toggleRole(u:any){const role=u.role==='Admin'?'Customer':'Admin';if(!confirm(`Change ${u.fullName} to ${role}?`))return;this.http.patch(`${apiBaseUrl}/Users/${u.id}/role`,{role}).subscribe(()=>{this.ok('User role updated');this.refresh()})}
  remove(path:string,id:number){if(!confirm('This action permanently deletes the selected record. Continue?'))return;this.http.delete(`${apiBaseUrl}/${path}/${id}`).subscribe({next:()=>{this.ok('Record deleted');this.refresh()},error:e=>this.ok(e?.error?.message||'Delete failed: record may be in use')})}
  apiName(s:string){return s==='categories'?'Categories':s==='brands'?'Brands':'Filters'} singular(s:string){return s.endsWith('ies')?s.slice(0,-3)+'y':s.slice(0,-1)} slug(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')} ok(v:string){this.message.set(v);setTimeout(()=>this.message.set(''),3000)} logout(){this.auth.logout();this.router.navigate(['/auth/login'])}
}
