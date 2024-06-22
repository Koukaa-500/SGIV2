import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private apiUrl = 'http://localhost:3000/account/accounts';

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }
  async addAccount(accountData: any): Promise<Observable<any>> {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${token}`
      });

      return this.http.post<any>('http://localhost:3000/account/add-account', accountData, { headers }).pipe(
        catchError((error) => {
          console.error('Error adding account:', error);
          return throwError('Something went wrong');
        })
      );
    } catch (error) {
      console.error('Error fetching user token:', error);
      return throwError('Failed to get token');
    }
  }
  async getAccounts(): Promise<Observable<any>> {
    try {
      const token = await this.storage.get('token');
      console.log('Token:', token);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${token}`
      });

      return this.http.get<any>(this.apiUrl, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching accounts:', error);
          return throwError('Something went wrong');
        })
      );
    } catch (error) {
      console.error('Error fetching user token:', error);
      return throwError('Failed to get token');
    }
  }
}
