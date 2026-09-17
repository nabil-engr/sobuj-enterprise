import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { apiBaseUrl } from "../../../core/config/api.config";

@Injectable({ providedIn: "root" })
export class AdminApiService {
  constructor(private readonly http: HttpClient) {}
  list<T>(resource: string): Observable<T[]> {
    return this.http.get<T[]>(`${apiBaseUrl}/${resource}`);
  }
  create<T>(resource: string, payload: unknown): Observable<T> {
    return this.http.post<T>(`${apiBaseUrl}/${resource}`, payload);
  }
  update<T>(resource: string, id: number, payload: unknown): Observable<T> {
    return this.http.put<T>(`${apiBaseUrl}/${resource}/${id}`, payload);
  }
  patch<T>(resource: string, id: number, payload: unknown): Observable<T> {
    return this.http.patch<T>(`${apiBaseUrl}/${resource}/${id}`, payload);
  }
  remove(resource: string, id: number): Observable<void> {
    return this.http.delete<void>(`${apiBaseUrl}/${resource}/${id}`);
  }
  uploadImage(file: File): Observable<{ url: string }> {
    const data = new FormData();
    data.append("file", file);
    return this.http.post<{ url: string }>(
      `${apiBaseUrl}/Uploads/product-image`,
      data,
    );
  }
}
