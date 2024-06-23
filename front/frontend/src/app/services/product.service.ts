import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private apiUrl = 'https://dummyjson.com/products';
private baseUrl = 'http://127.0.0.1:3000/product/stocks'
   constructor(private http: HttpClient) {}

  // getProducts(): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }

  // updateProductStock(product: any): void {
  //   this.http.put(`https://dummyjson.com/products/${product.id}`, { stock: product.stock })
  //     .subscribe(response => {
  //       console.log('Stock updated', response);
  //     });
  // }


  // private apiKey = 'OQQQU26RXH4IHQI7';
  // private baseUrl = 'https://www.alphavantage.co/query';

  // getStockData(symbol: string): Observable<any> {
  //   const url = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
  //   return this.http.get(url);
  // }

  private stocks = [
    { symbol: 'AAPL', price: 150, change: +1.5, color: 'green', type: 'Tech', validity: '30', quantity: 100 },
    { symbol: 'GOOGL', price: 2700, change: -0.5, color: 'red', type: 'Tech', validity: '30', quantity: 50 },
    { symbol: 'AMZN', price: 3300, change: +2.1, color: 'green', type: 'E-Commerce', validity: '30', quantity: 200 },
    { symbol: 'MSFT', price: 290, change: -1.2, color: 'red', type: 'Tech', validity: '30', quantity: 150 },
    { symbol: 'TSLA', price: 620, change: +3.0, color: 'green', type: 'Automotive', validity: '30', quantity: 80 },
    { symbol: 'FB', price: 340, change: -0.7, color: 'red', type: 'Social Media', validity: '30', quantity: 70 },
    { symbol: 'AAPL', price: 150, change: +1.5, color: 'green', type: 'Tech', validity: '30', quantity: 100 },
    { symbol: 'GOOGL', price: 2700, change: -0.5, color: 'red', type: 'Tech', validity: '30', quantity: 50 },
    { symbol: 'AMZN', price: 3300, change: +2.1, color: 'green', type: 'E-Commerce', validity: '30', quantity: 200 },
    { symbol: 'MSFT', price: 290, change: -1.2, color: 'red', type: 'Tech', validity: '30', quantity: 150 },
    { symbol: 'TSLA', price: 620, change: +3.0, color: 'green', type: 'Automotive', validity: '30', quantity: 80 },
    { symbol: 'FB', price: 340, change: -0.7, color: 'red', type: 'Social Media', validity: '30', quantity: 70 }
  ];

  getStockBySymbol(symbol: string) {
    return this.stocks.find(stock => stock.symbol === symbol);
  }
  updateStockQuantity(symbol: string, newQuantity: number): boolean {
    const stockIndex = this.stocks.findIndex(stock => stock.symbol === symbol);

    if (stockIndex !== -1) {
      // Ensure new quantity is not negative
      this.stocks[stockIndex].quantity = Math.max(0, newQuantity);
      return true; // Return true if update was successful
    }

    return false; // Return false if stock symbol was not found
  }
  saveStockPrice(symbol: string, price: number,change:number) {
    return this.http.post<any>(this.baseUrl, { symbol, price,change });
  }

}
