import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(command: any): Observable<any> {
    const formData = new FormData();
    formData.append('UserName', command.userName);
    formData.append('Password', command.password);
    
    return this.http.post(`${this.apiUrl}/Authentication/SignIn`, formData).pipe(
      tap((response: any) => {
        if (response && response.data && response.data.accessToken) {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ApplicationUser/Create`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // The ID is usually in sub or nameidentifier claim
        const idClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub || payload.Id || payload.id;
        return idClaim ? Number(idClaim) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  getUserProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ApplicationUser/GetUserByID?id=${id}`);
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ApplicationUser/Edit`, userData);
  }
}
