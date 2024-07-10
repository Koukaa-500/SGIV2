import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://10.1.1.68:3000/product/stocks';
  private baseUrl1 = 'http://10.1.1.68:3000/user';

  constructor(private http: HttpClient, private storage: Storage) {
    this.updateStockStatusBasedOnTime();
  }
    public stocks = [
    { "symbol": "AAPL", "price": 150, "change": +1.5, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 100, "status": "Disponible" },
    { "symbol": "GOOGL", "price": 2700, "change": -0.5, "color": "red", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 50, "status": "Non-Disponible" },
    { "symbol": "AMZN", "price": 3300, "change": +2.1, "color": "green", "type": "E-Commerce", "validity": "30", "favorite" :false ,"quantity": 200, "status": "Non-Disponible" },
    { "symbol": "MSFT", "price": 290, "change": -1.2, "color": "red", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 150, "status": "Disponible" },
    { "symbol": "TSLA", "price": 620, "change": +3.0, "color": "green", "type": "Automotive", "validity": "30", "favorite" :false ,"quantity": 80, "status": "Non-Disponible" },
    { "symbol": "FB", "price": 340, "change": -0.7, "color": "red", "type": "Social Media", "validity": "30", "favorite" :false ,"quantity": 70, "status": "Disponible" },
    { "symbol": "NFLX", "price": 500, "change": +1.0, "color": "green", "type": "Entertainment", "validity": "30", "favorite" :false ,"quantity": 60, "status": "Non-Disponible" },
    { "symbol": "NVDA", "price": 600, "change": +2.5, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 90, "status": "Disponible" },
    { "symbol": "BABA", "price": 220, "change": -0.8, "color": "red", "type": "E-Commerce", "validity": "30", "favorite" :false ,"quantity": 110, "status": "Non-Disponible" },
    { "symbol": "INTC", "price": 58, "change": +0.3, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 130, "status": "Disponible" },
    { "symbol": "PYPL", "price": 250, "change": -1.1, "color": "red", "type": "Finance", "validity": "30", "favorite" :false ,"quantity": 75, "status": "Disponible" },
    { "symbol": "UBER", "price": 45, "change": +0.7, "color": "green", "type": "Transport", "validity": "30", "favorite" :false ,"quantity": 140, "status": "Disponible" },
    { "symbol": "DIS", "price": 175, "change": -0.6, "color": "red", "type": "Entertainment", "validity": "30", "favorite" :false ,"quantity": 95, "status": "Disponible" },
    { "symbol": "ORCL", "price": 85, "change": +1.8, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 120, "status": "Non-Disponible" },
    { "symbol": "CSCO", "price": 55, "change": +0.4, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 160, "status": "Non-Disponible" },
    { "symbol": "ADBE", "price": 510, "change": -0.9, "color": "red", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 85, "status": "Disponible" },
    { "symbol": "CRM", "price": 220, "change": +2.0, "color": "green", "type": "Tech", "validity": "30", "favorite" :false ,"quantity": 110, "status": "Disponible" }
  ];
  async toggleFavorite(symbol: string, isFavorite: boolean): Promise<Observable<any>> {
    const stock = this.stocks.find(s => s.symbol === symbol);
    if (!stock) {
      console.error('Stock not found');
      return throwError(() => new Error('Stock not found'));
    }
  
    try {
      const token = await this.storage.get('token');
      if (!token) {
        console.error('Token not found');
        return throwError(() => new Error('Token not found'));
      }
      
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${token}`
      });
    
      const requestPayload = {
        stockId: stock.symbol,
        isFavorite
      };
      console.log('Request payload:', requestPayload);
    
      return this.http.post<any>(`http://10.1.1.68:3000/user/favorite1`, requestPayload, { headers }).toPromise();
    } catch (error) {
      console.error('An error occurred:', error);
      return throwError(() => new Error('An error occurred'));
    }
}
  
  
  // async getFavoriteStocks(): Promise<Observable<void>> {
  //   const token = await this.storage['get']('token');
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'token': `${token}`
  //   });
  //   return this.http.get<any[]>(`${this.baseUrl1}/favorite`, { headers }).pipe(
  //     map((favorites: any[]) => {
  //       const stocks1 = this.stocks.map(stock => ({
  //         ...stock,
  //         favorite: favorites.some(favorite => favorite.symbol === stock.symbol)
  //       }));
  //       console.log('Favorite stocks:', stocks1);
  //       this.stocks = stocks1;
  //      })
  //   );
  // }

  async getFavoriteStocks(): Promise<Observable<void>> {
    const token = await this.storage.get('token');
    console.log(token);
    if (!token) {
      return throwError(() => new Error('Token not found'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': `${token}`
    });
  
    return this.http.get<string[]>(`http://10.1.1.68:3000/user/favorite`, { headers }).pipe(
      map((favoriteSymbols: string[]) => {
        this.stocks = this.stocks.map(stock => ({
          ...stock,
          favorite: favoriteSymbols.includes(stock.symbol)
        }));
        console.log('Updated stocks with favorite status:', this.stocks);
      }),
      catchError((error) => {
        console.error('Failed to fetch favorite stocks:', error);
        return throwError(() => new Error('Failed to fetch favorite stocks'));
      })
    );
  }
  


  private updateStockStatusBasedOnTime(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    this.stocks.forEach(stock => {
      if (currentHour >= 20 || currentHour < 6) {
        stock.status = 'Non-Disponible';
      }
    });
  }

  getStockBySymbol(symbol: string) {
    return this.stocks.find(stock => stock.symbol === symbol);
  }


  getStatus(status: string) {
    return this.stocks.find(stock => stock.status === status);
  }

  updateStockQuantity(symbol: string, newQuantity: number): boolean {
    const stock = this.stocks.find(stock => stock.symbol === symbol);
    if (stock) {
      stock.quantity = Math.max(0, newQuantity);
      return true;
    }
    return false;
  }

  saveStockPrice(symbol: string, price: number, change: number) {
    return this.http.post<any>(this.baseUrl, { symbol, price, change });
  }
}
