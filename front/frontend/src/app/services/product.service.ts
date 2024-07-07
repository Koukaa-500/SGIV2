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
    { "symbol": "AAPL", "price": 150, "change": +1.5, "color": "green", "type": "Tech", "validity": "30", "quantity": 100  ,"status":"Disponible"},
    { "symbol": "GOOGL", "price": 2700, "change": -0.5, "color": "red", "type": "Tech", "validity": "30", "quantity": 50 ,"status":"Non-Disponible"},
    { "symbol": "AMZN", "price": 3300, "change": +2.1, "color": "green", "type": "E-Commerce", "validity": "30", "quantity": 200  ,"status":"Non-Disponible"},
    { "symbol": "MSFT", "price": 290, "change": -1.2, "color": "red", "type": "Tech", "validity": "30", "quantity": 150  ,"status":"Disponible"},
    { "symbol": "TSLA", "price": 620, "change": +3.0, "color": "green", "type": "Automotive", "validity": "30", "quantity": 80  ,"status":"Non-Disponible"},
    { "symbol": "FB", "price": 340, "change": -0.7, "color": "red", "type": "Social Media", "validity": "30", "quantity": 70  ,"status":"Disponible"},
    { "symbol": "NFLX", "price": 500, "change": +1.0, "color": "green", "type": "Entertainment", "validity": "30", "quantity": 60 ,"status":"Non-Disponible"} ,
    { "symbol": "NVDA", "price": 600, "change": +2.5, "color": "green", "type": "Tech", "validity": "30", "quantity": 90  ,"status":"Disponible"},
    { "symbol": "BABA", "price": 220, "change": -0.8, "color": "red", "type": "E-Commerce", "validity": "30", "quantity": 110  ,"status":"Non-Disponible"},
    { "symbol": "INTC", "price": 58, "change": +0.3, "color": "green", "type": "Tech", "validity": "30", "quantity": 130  ,"status":"Disponible"},
    { "symbol": "PYPL", "price": 250, "change": -1.1, "color": "red", "type": "Finance", "validity": "30", "quantity": 75  ,"status":"Disponible"},
    { "symbol": "UBER", "price": 45, "change": +0.7, "color": "green", "type": "Transport", "validity": "30", "quantity": 140  ,"status":"Disponible"},
    { "symbol": "DIS", "price": 175, "change": -0.6, "color": "red", "type": "Entertainment", "validity": "30", "quantity": 95  ,"status":"Disponible"},
    { "symbol": "ORCL", "price": 85, "change": +1.8, "color": "green", "type": "Tech", "validity": "30", "quantity": 120  ,"status":"Non-Disponible"},
    { "symbol": "CSCO", "price": 55, "change": +0.4, "color": "green", "type": "Tech", "validity": "30", "quantity": 160 ,"status":"Non-Disponible" },
    { "symbol": "ADBE", "price": 510, "change": -0.9, "color": "red", "type": "Tech", "validity": "30", "quantity": 85  ,"status":"Disponible"},
    { "symbol": "CRM", "price": 220, "change": +2.0, "color": "green", "type": "Tech", "validity": "30", "quantity": 110 ,"status":"Disponible"} 
]
;

  getStockBySymbol(symbol: string) {
    return this.stocks.find(stock => stock.symbol === symbol);
  }
  getStatus(status:string){
    return this.stocks.find(stock=>stock.status === status)
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
