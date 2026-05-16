import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/Category`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllCategory`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetByID?id=${id}`);
  }

  create(category: any): Observable<any> {
    const formData = new FormData();
    formData.append('Name', category.name);
    if (category.description) formData.append('Description', category.description);
    if (category.file) formData.append('File', category.file);
    return this.http.post(`${this.apiUrl}/CreateCategory`, formData);
  }

  update(category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Edit`, category);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Delete?id=${id}`);
  }
}
