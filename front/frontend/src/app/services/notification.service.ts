import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://192.168.1.149:3000/user'; // Replace with your API base URL

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
    return this.http.get<any[]>(`${this.apiUrl}/notifications`, { headers });
  }

  
  async addNotification(message: string, color: string = 'default'): Promise<any> {
    try {
      const token = await this.storage.get('token');
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${token}`
      });
  
      return this.http.post<any>(`${this.apiUrl}/notifications1`, { message, color }, { headers })
        .toPromise();
    } catch (error) {
      console.error('Error adding notification:', error);
      throw new Error('Failed to add notification');
    }
  }
  
  
  async getUnreadCount(): Promise<Observable<{ unreadCount: number }>> {
    const token = await this.storage.get('token');
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${token}`
    });
  
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/notifications/unread`, { headers });
  }
  
  
  

  async markAsRead(notificationId: string): Promise<Observable<any>> {
    const token = await this.storage['get']('token');
    console.log(token);
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${token}`
    });
    return this.http.put<number>(`${this.apiUrl}/notifications/${notificationId}/read`, {}, { headers });
  }
  
}
