import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, FilterAttribute, PagedResult } from '../models/models';
import { apiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Direct HTTP backend URL when running locally
  private readonly baseUrl = `${apiBaseUrl}/Products`;
  private readonly filterUrl = `${apiBaseUrl}/Filters`;

  constructor(private http: HttpClient) {}

  public getProducts(paramsObj?: {
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    filterValueIds?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    if (paramsObj) {
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<PagedResult<Product>>(this.baseUrl, { params });
  }

  public getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${slug}`);
  }

  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/id/${id}`);
  }

  public getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/admin`);
  }

  public createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  public updateProduct(id: number, product: Partial<Product>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  public deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  public getFilterAttributes(categoryId?: number): Observable<FilterAttribute[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    return this.http.get<FilterAttribute[]>(this.filterUrl, { params });
  }

  public createFilterAttribute(attr: Partial<FilterAttribute>): Observable<FilterAttribute> {
    return this.http.post<FilterAttribute>(this.filterUrl, attr);
  }

  public getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${apiBaseUrl}/Brands`);
  }
}
