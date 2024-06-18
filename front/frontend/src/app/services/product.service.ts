import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateProductStock(product: any): void {
    this.http.put(`https://dummyjson.com/products/${product.id}`, { stock: product.stock })
      .subscribe(response => {
        console.log('Stock updated', response);
      });
  }


  private apiKey = 'OQQQU26RXH4IHQI7';
  private baseUrl = 'https://www.alphavantage.co/query';

  getStockData(symbol: string): Observable<any> {
    const url = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(url);
  }
}
