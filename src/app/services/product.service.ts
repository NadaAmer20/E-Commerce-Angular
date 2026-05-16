import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Product`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllProduct`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetByID?id=${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Create`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditProduct`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete?id=${id}`);
  }

  getPaginated(pageNumber: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ProductsPaginated?PageNumber=${pageNumber}&PageSize=${pageSize}`);
  }
}
