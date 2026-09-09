import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User, UserAddress } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'sobuj_auth_token';
  private readonly USER_KEY = 'sobuj_user_profile';
  private readonly baseUrl = 'http://localhost:5000/api/Auth';

  private currentUserSignal = signal<User | null>(this.getStoredUser());
  public currentUser = this.currentUserSignal.asReadonly();

  public isAuthenticated = computed(() => !!this.currentUserSignal());
  public isAdmin = computed(() => this.currentUserSignal()?.role === 'Admin');

  constructor(private http: HttpClient) {}

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public register(payload: { fullName: string; email: string; password: string; phoneNumber?: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  public login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  public updateProfile(payload: { fullName: string; phoneNumber?: string }): Observable<any> {
    return this.http.put<any>('http://localhost:5000/api/Users/profile', payload).pipe(
      tap(updatedUser => {
        const current = this.currentUserSignal();
        if (current) {
          const merged: User = {
            ...current,
            fullName: updatedUser.fullName,
            phoneNumber: updatedUser.phoneNumber
          };
          localStorage.setItem(this.USER_KEY, JSON.stringify(merged));
          this.currentUserSignal.set(merged);
        }
      })
    );
  }

  public getProfile(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/Users/profile');
  }

  public getAddresses(): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>('http://localhost:5000/api/Users/addresses');
  }

  public saveAddress(payload: Partial<UserAddress>): Observable<UserAddress> {
    return this.http.post<UserAddress>('http://localhost:5000/api/Users/addresses', payload);
  }

  public deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/api/Users/addresses/${id}`);
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    const user: User = {
      id: res.userId,
      fullName: res.fullName,
      email: res.email,
      role: res.role
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
