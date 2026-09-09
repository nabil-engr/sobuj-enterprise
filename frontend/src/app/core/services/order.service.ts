import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderDto, OrderResponseDto, Order } from '../models';
import { apiBaseUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = `${apiBaseUrl}/Orders`;

  constructor(private http: HttpClient) {}

  public placeOrder(dto: CreateOrderDto): Observable<OrderResponseDto> {
    return this.http.post<OrderResponseDto>(this.baseUrl, dto);
  }

  public getOrders(status?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Order[]>(this.baseUrl, { params });
  }

  public getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/my-orders`);
  }

  public getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  public updateOrderStatus(id: number, status: string, adminNote?: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, { status, adminNote });
  }

  public cancelOrder(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${id}/cancel`, {});
  }
}
