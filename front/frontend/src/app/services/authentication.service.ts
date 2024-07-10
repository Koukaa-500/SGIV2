import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://10.1.1.68:3000/user'; // Replace with your backend URL

  constructor(private http: HttpClient, private storage: Storage , private router : Router) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        this.storage.set('token', response.mytoken);
        console.log(response.mytoken);
        return response;
      })
    );
  }
  getUserProfileImageUrl(userId: string){
    return this.http.get(`${this.apiUrl}/get-image/${userId}` + Image);
  }

  async getToken(): Promise<string | number> {
    return await this.storage.get('token');
  }

  async logout() {
    await this.storage.remove('token');
    this.router.navigate(['/login']);
  }
  async getUserProfile() {
    try {
      const token = await this.getToken(); // Await the Promise

      // Set headers with resolved token
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': token,
      });

      return this.http.get<any>(`${this.apiUrl}/get`, { headers })
        .pipe(
          catchError((error) => {
            console.error('Error fetching user profile:', error);
            return throwError('Something went wrong');
          })
        );
    } catch (error) {
      console.error('Error fetching user token:', error);
      return throwError('Failed to get token');
    }
  }
  
// Method to update user profile
async updateUserProfile(data: any){
  const token = await this.getToken(); // Assuming getToken() retrieves the token from storage

   // Set headers with resolved token
   const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': token,
  });

  return this.http.put<any>(`${this.apiUrl}/update`, data, { headers }).pipe(
    catchError((error) => {
      console.error('Error updating user profile:', error);
      return throwError('Something went wrong');
    })
  );
}

async changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  const token = await this.getToken(); // Assuming getToken() retrieves the token from storage

   // Set headers with resolved token
   const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'token': token,
  });
  if (newPassword !== confirmPassword) {
    console.error('New passwords do not match');
    return throwError('New passwords do not match');
  }

  return this.http.post<any>(`${this.apiUrl}/forget`,  {
    oldPassword,
    newPassword,
    confirmPassword
  },{ headers }).pipe(
    catchError((error) => {
      console.error('Error changing password:', error);
      return throwError('Failed to change password');
    })
  );
}
}
