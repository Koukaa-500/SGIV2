import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your API base URL

  constructor(private http: HttpClient,  private storage: Storage) { }

  async getNotifications(): Promise<Observable<string[]>> {
    const token = await this.storage['get']('token');
    console.log(token);
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${token}`
    });
    return this.http.get<string[]>(`${this.apiUrl}/notifications`, { headers });
  }
}
