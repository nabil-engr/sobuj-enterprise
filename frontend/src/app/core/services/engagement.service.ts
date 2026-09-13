import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../config/api.config';

export interface ProductReview { id: number; rating: number; title: string; comment: string; isVerifiedPurchase: boolean; createdAt: string; customer: string; }

@Injectable({ providedIn: 'root' })
export class EngagementService {
  constructor(private http: HttpClient) {}
  reviews(productId: number): Observable<ProductReview[]> { return this.http.get<ProductReview[]>(`${apiBaseUrl}/engagement/products/${productId}/reviews`); }
  stockAlert(productId: number, email: string): Observable<{message: string}> { return this.http.post<{message: string}>(`${apiBaseUrl}/engagement/products/${productId}/stock-alerts`, { email }); }
  submitReview(productId: number, review: {rating: number; title: string; comment: string}): Observable<unknown> { return this.http.post(`${apiBaseUrl}/engagement/products/${productId}/reviews`, review); }
  validateCoupon(code: string, subtotal: number): Observable<{code: string; discount: number}> { return this.http.post<{code: string; discount: number}>(`${apiBaseUrl}/engagement/coupons/validate`, { code, subtotal }); }
}
